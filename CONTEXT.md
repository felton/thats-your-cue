# thats-your-cue

A starter that engineers and coding agents copy to build a site or app, with the setup already done right so the work goes into the brief rather than the toolchain.

## Language

**Template**:
The `template/` folder of this repo, released as `template-v…` tags that people copy.
_Avoid_: starter, boilerplate, scaffold

**Derived project**:
A project made by copying a **Template** release and making it yours.
_Avoid_: my-app, your project, the site

**Docs site**:
The **Derived project** in the `docs/` folder that documents the **Template** and is deployed to GitHub Pages.
_Avoid_: docs (on its own), the docs page

**Brief**:
What an engineer tells an agent the **Derived project** should be.
_Avoid_: prompt, spec

**Check-in**:
A point where the agent stops to ask the engineer for context the **Brief** didn't give.
_Avoid_: clarifying question, interruption

**Deployable**:
A **Derived project** that passes `pnpm check` and builds for its hosting target, whether or not it has been published.
_Avoid_: deployed, live, shipped

**Site URL**:
The full public address of a **Derived project**, including any subpath (`https://felton.github.io/thats-your-cue`), or empty while it is **Not public yet**.
_Avoid_: origin, domain, base URL, homepage

**Not public yet**:
The state of a **Derived project** with no **Site URL**: it runs locally and in containers, and leaves out tags that need an absolute address.
_Avoid_: unconfigured, placeholder

**Site-wide tags**:
Head tags that every page gets automatically (site name, social image, card type, and the canonical link worked out from the page's address).
_Avoid_: default meta, global meta

**Page tags**:
Head tags that each page writes for itself (title, description).
_Avoid_: route meta, SEO tags

**On top**:
Whatever a **Brief** adds beyond the **Template**'s setup, such as data, auth or storage, chosen to the **Brief**'s spec.
_Avoid_: extras, add-ons, plugins

## Relationships

- A **Template** release produces zero or more **Derived projects**
- The **Docs site** is one **Derived project**, and it documents exactly one **Template** release at a time
- A **Brief** describes one **Derived project**
- A **Derived project** has exactly one **Site URL**, and its subpath is where the project is served from
- A **Derived project** has one social image, carried in its **Site-wide tags**; each page sets only its own **Page tags**
- The agent guide (`AGENTS.md` and skills) holds everything needed to get from a **Brief** to **Deployable**; the **Docs site** explains why and covers what comes after. When they disagree, the agent guide wins
- The **Template** supports everything around a **Derived project** (app shape, tooling, styling, tests); what goes **On top** is the **Brief**'s job
- When a **Brief** leaves out both the **Site URL** and an **On top** choice, the **Check-in** asks about the **On top** choice; the project stays **Not public yet** until someone sets the **Site URL**
- Getting from a **Brief** to a **Deployable** project should take few **Check-ins** (one is fine), far fewer than setting up the same stack from scratch

## Example dialogue

> **Dev:** "The **Brief** asked for a booking app but named no database or host. The agent used its **Check-in** on the database, and the **Derived project** is **Deployable** but **Not public yet**. Is it done?"
> **Domain expert:** "Yes. The database is **On top**, so it was worth the **Check-in**. The **Site URL** can be set later. **Deployable** means it passes `pnpm check` and builds, not that it's live."

## Flagged ambiguities

- "one-shot" was used for the goal. Resolved: the goal is fewer interactions than setting up from scratch, not zero. Don't use "one-shot".
- "docs" was used for the `docs/` folder (once a `docs` branch), the deployed **Docs site**, its MDX pages, and `AGENTS.md`/skills. Resolved: say **Docs site** for the site. The agent-facing files are not docs.
- "version" can mean a **Template** release, a **Derived project**'s own `version`, or the release the **Docs site** documents. Resolved: always say which.
