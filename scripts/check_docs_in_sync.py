#!/usr/bin/env python3
"""Fail if the code in this repo differs from the code printed on https://www.screenlyyid.com/docs/recipes/.

The recipe pages and these examples show the same code. This fetches the Markdown of each recipe page, takes its fenced code blocks and
checks that every file listed below appears in one of them, character for character (apart from trailing whitespace).

  python3 scripts/check_docs_in_sync.py            # check against the live docs
"""
import re
import sys
import urllib.request

DOCS = "https://www.screenlyyid.com/docs/recipes/%s.md"
FILES = {
    "express": ["express/server.js"],
    "fastapi": ["fastapi/main.py"],
    "nextjs": ["nextjs/lib/screenlyyid.js", "nextjs/app/api/verifications/route.js", "nextjs/app/api/verifications/[id]/route.js",
               "nextjs/app/page.js", "nextjs/jsconfig.json"],
}


def blocks(markdown):
    return [b.rstrip() for b in re.findall(r"```[a-z]*\n(.*?)```", markdown, re.S)]


def main():
    bad = []
    for page, files in FILES.items():
        req = urllib.request.Request(DOCS % page, headers={"Accept": "text/markdown", "User-Agent": "screenlyyid-examples-sync-check"})
        found = blocks(urllib.request.urlopen(req, timeout=30).read().decode("utf-8"))
        for path in files:
            code = open(path, encoding="utf-8").read().rstrip()
            if code not in found:
                bad.append("%s is not the code shown on %s" % (path, DOCS % page))
    for line in bad:
        print("OUT OF SYNC:", line)
    if bad:
        print("Update the examples or the docs so they match (the docs live in the website repo: docs/content/recipes/).")
        sys.exit(1)
    print("examples match the docs (%d files)" % sum(len(v) for v in FILES.values()))


if __name__ == "__main__":
    main()
