---
title: 内容与版权说明
description: Content and Copyright Policy
---

# 内容与版权说明 (Content Policy)

本页面向读者说明本站点与本仓库在内容、版权、合规方面的立场，
并对应 [GitHub 服务条款](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service)
中的相关条款，特别是 D (User-Generated Content)、F (Copyright & DMCA)、
G (Intellectual Property Notice / Trademarks)。

This page states the policy of this site and repository with respect
to content, copyright and compliance, and maps to the relevant sections
of the GitHub Terms of Service — in particular Section D (User-Generated
Content), Section F (Copyright & DMCA) and Section G (Intellectual
Property / Trademarks).

## 1. Ownership and Licensing

| Scope                                  | Default License             | Notes                                                                 |
| -------------------------------------- | --------------------------- | --------------------------------------------------------------------- |
| Repository source code (`*.ts`, `*.json`, workflows, scripts) | MIT                          | See top-level `LICENSE`.                                               |
| Author-written blog posts and pages (Markdown under `docs/posts/**`) | CC BY-NC-SA 4.0 (deed.zh-hans) | Configured in `docs/.vitepress/config.ts` → `creativeCommons`.        |
| Bundled dependencies                   | Their own licenses (MIT / SATA / OFL / Apache-2.0 etc.) | See `NOTICE` at the repository root.                                  |
| Third-party documents reproduced as posts | The upstream project's license, with attribution | See "Third-party content" below.                                      |

Posts reuse Creative Commons via the `creativeCommons` theme plugin
where applicable; long-form adaptations cite their upstream source at
the head of the post.

## 2. User-Generated Content (UGC)

Posts, comments (when comment functionality is enabled on a per-post
basis) and any other material authored via the repository are
"User-Generated Content" within the meaning of GitHub's Terms. By
posting via this repository the author:

- Affirms that they own or have sufficient rights to publish the
  material (GitHub ToS §D.3).
- Grants GitHub and other users the licenses described in §D.4–D.8
  of the GitHub Terms solely so that GitHub can host and serve the
  repository and the deployed site.

The author is solely responsible for the legality of every file added
to the repository. Please do not open issues with copies of infringing
material; report concerns as described below.

## 3. Third-party content

Where a post quotes, summarizes, or translates a third-party document
(software documentation, a third-party wiki, a public manual, etc.) the
post must:

- Clearly credit the upstream project name, a link to the source,
  and the license under which the upstream material is shared.
- Mark added commentary versus quoted material where reasonable.
- Refrain from reproducing more of the upstream work than is needed
  for the purpose of the post.

For the `docs/posts/ai/cc-switch.md` post, the upstream project is
CC Switch at <https://github.com/farion1231/cc-switch>. The license of
the upstream documentation is the license declared in that repository's
own `LICENSE` file; redistribute verbatim excerpts only in accordance
with that license and with attribution.

## 4. Acceptable Use

The repository and the deployed site must not be used to host or
distribute material that:

- Infringes copyright, trademark, or other intellectual-property
  rights.
- Violates the GitHub Acceptable Use Policies or Community Guidelines
  (<https://docs.github.com/en/site-policy/github-terms/github-acceptable-use-policies>).
- Is intended to circumvent third-party service terms, access
  controls, billing, quotas, or account restrictions, even where the
  underlying technology is otherwise lawful.
- Constitutes disallowed content (CSAM, NCII, malware, doxxing,
  harassment, hate speech, violent extremism, etc.) as described in
  the GitHub Acceptable Use Policies.

Posts that describe such capabilities (e.g. multi-vendor tooling for
AI coding assistants) include an explicit "合规边界说明" section
clarifying that the description is informational only and that the
user is responsible for staying within applicable law and provider
terms.

## 5. Reporting a concern

If you believe that material in this repository or on the deployed
site infringes your rights, please:

1. Open an issue on this repository (preferred for non-sensitive
   concerns), **or**
2. Email the author at the address published in `package.json`
   `author.email`, **or**
3. Submit a formal DMCA notice to GitHub as described at
   <https://docs.github.com/en/site-policy/github-terms/github-terms-of-service#f-copyright-infringement-and-dmca-policy>.

For an informal notice, include:

- Identification of the work you claim is infringed.
- The URL or file path in this repo or on the deployed site where
  the allegedly infringing material appears.
- Your contact details and a statement that you have a good-faith
  belief that the use is not authorized.
- A statement, under penalty of perjury, that you are authorized
  to act on behalf of the rights holder.

The author aims to acknowledge reports within a reasonable window
and will remove, attribute or otherwise respond to the report in line
with the rights of the parties involved.

## 6. Trademarks and logos

Where the site links to external services (GitHub, etc.), the marks
used in the social section identify the linked service nominatively
in accordance with the GitHub Logo Policy
(<https://github.com/logos>) and the GitHub Trademark Policy. No
modification, color alteration, or combination with other marks is
performed beyond what the upstream theme provides. Third-party
trademark owners can raise concerns via the contact channels above.

## 7. Privacy

The site does not set first-party analytics or tracking cookies and
does not collect visitor identifiers beyond what GitHub Pages records
in its standard server logs. The site's about-page privacy text
provides a plain-language summary in the local language.
