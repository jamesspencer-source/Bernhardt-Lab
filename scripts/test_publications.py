"""Offline regressions for chronological citation selection and safe refreshes."""

import copy
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import publication_data as data
import refresh_recent_publications as refresh


def record(pmid, **overrides):
    return {
        "uid": str(pmid), "title": f"Test citation {pmid}.",
        "authors": [{"name": "Researcher A"}, {"name": "Bernhardt TG"}, {"name": "Collaborator B"}],
        "fulljournalname": "Nature Microbiology", "pubtype": ["Journal Article"],
        "pubdate": "2025 Dec", "epubdate": "2025 Nov 3",
        "articleids": [{"idtype": "doi", "value": f"10.1234/test.{pmid}"}],
        **overrides,
    }


def summary(records):
    return {"uids": [item["uid"] for item in records], **{item["uid"]: item for item in records}}


def payload():
    records = [record(i) for i in range(1, 7)]
    result = summary(records)
    return {"query": data.SEARCH_TERM, "selection": "journal-published", "count": 6,
            "items": refresh.select_publications(result, result["uids"])}


class PublicationTests(unittest.TestCase):
    def test_collaborations_and_exact_author_identity(self):
        for name in ("Bernhardt TG", "Thomas G. Bernhardt", "Thomas Gordon Bernhardt"):
            self.assertTrue(data.is_bernhardt_author(name))
        for name in ("Bernhardt T", "Bernhardt TM", "Thomas Bernhardt Jr", "Bernhardt J"):
            self.assertFalse(data.is_bernhardt_author(name))
        self.assertEqual(len(data.validate_feed(payload())), 6)

    def test_excluded_records_do_not_displace_journal_articles(self):
        for overrides in (
            {"fulljournalname": "bioRxiv"}, {"pubtype": ["Preprint"]},
            {"pubtype": ["Published Erratum"]}, {"pubtype": ["Retracted Publication"]},
            {"title": "Author correction: Test"}, {"authors": [{"name": "Bernhardt TM"}]},
        ):
            with self.subTest(overrides=overrides):
                result = summary([record(1, **overrides), record(2)])
                self.assertEqual([item["pmid"] for item in refresh.select_publications(result, result["uids"])], ["2"])

    def test_online_date_precedes_future_issue_date_for_sorting(self):
        result = summary([record(1, pubdate="2099 Dec", epubdate="2025 Jan 1"), record(2)])
        items = refresh.select_publications(result, result["uids"])
        self.assertEqual([item["pmid"] for item in items], ["2", "1"])
        self.assertEqual(items[1]["publishedAt"], "2025-01-01")
        self.assertEqual(data.publication_date("2025 Nov"), "2025-11")
        self.assertEqual(data.date_label("2025-11"), "Nov 2025")
        self.assertEqual(data.date_label("2025-11-03"), "Nov 3, 2025")
        self.assertEqual(data.date_label("2025"), "2025")

    def test_duplicate_doi_and_incomplete_response(self):
        result = summary([record(1), record(2, articleids=record(1)["articleids"])])
        self.assertEqual(len(refresh.select_publications(result, result["uids"])), 1)
        with self.assertRaisesRegex(ValueError, "Incomplete"):
            refresh.select_publications(result, ["1", "2", "3"])
        del result["1"]
        with self.assertRaisesRegex(ValueError, "Missing"):
            refresh.select_publications(result, result["uids"])

    def test_plain_citation_and_pubmed_fallback(self):
        result = summary([record(1, title="A &amp; B in <i>E. coli</i>.", articleids=[])])
        item = refresh.select_publications(result, result["uids"])[0]
        self.assertEqual(item["title"], "A & B in E. coli")
        self.assertEqual(item["articleUrl"], "https://pubmed.ncbi.nlm.nih.gov/1/")

    def test_invalid_feed_is_rejected(self):
        mutations = [
            lambda p: p["items"].reverse(),
            lambda p: p["items"].pop(),
            lambda p: p["items"][0].update(title="<i>Raw HTML</i>"),
            lambda p: p["items"][0].update(articleUrl="https://example.org/wrong"),
            lambda p: p["items"][0].update(publishedAt="2099-01-01"),
            lambda p: p["items"][0].update(publishedAt="2025-02-30"),
            lambda p: p["items"][0].update(authors=["Bernhardt TM"]),
            lambda p: p["items"][0].update(journal="bioRxiv"),
            lambda p: p["items"][0].update(pmid=p["items"][1]["pmid"]),
            lambda p: p["items"][0].update(doi=p["items"][1]["doi"]),
        ]
        for mutation in mutations:
            changed = copy.deepcopy(payload())
            mutation(changed)
            with self.assertRaises(ValueError):
                data.validate_feed(changed)

    def test_refresh_failure_and_no_change_preserve_saved_bytes(self):
        result = summary([record(i) for i in range(1, 7)])
        search = {"esearchresult": {"idlist": result["uids"], "count": "6"}}
        with tempfile.TemporaryDirectory() as directory, patch.object(refresh.time, "sleep"):
            root = Path(directory)
            with patch.object(refresh, "fetch_json", side_effect=[search, {"result": result}]) as fetch:
                self.assertTrue(refresh.refresh(root))
                self.assertEqual(fetch.call_args_list[0].kwargs["sort"], "pub_date")
            path = root / data.FEED_PATH
            before = path.read_bytes()
            with patch.object(refresh, "fetch_json", side_effect=[search, {"result": result}]):
                self.assertFalse(refresh.refresh(root))
            self.assertEqual(path.read_bytes(), before)
            for responses in (
                [OSError("Network unavailable")],
                [{"esearchresult": {"idlist": []}}],
                [search, {"result": summary([record(1)])}],
                [{"esearchresult": {"idlist": ["1"], "count": "1"}}, {"result": summary([record(1)])}],
                [{"esearchresult": {"idlist": result["uids"], "count": "100"}}],
            ):
                with patch.object(refresh, "fetch_json", side_effect=responses), self.assertRaises((OSError, ValueError)):
                    refresh.refresh(root)
                self.assertEqual(path.read_bytes(), before)


if __name__ == "__main__":
    unittest.main()
