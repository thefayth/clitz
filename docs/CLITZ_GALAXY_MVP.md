# CLITZ Galaxy Core MVP

CLITZ Galaxy Core is the private WordPress MVP capability behind the first public CLITZ surface.

The MVP is not released as open source. This document names the public-facing capability and interface without publishing private implementation details.

## Content Types

The MVP supports these platform lanes:

- missing women and girls
- providers
- domestic violence services
- assault resources
- mutual aid requests
- fundraisers
- reviews
- prayer rooms
- debate topics
- creator profile reuse

## Shared Filters

The MVP uses shared taxonomy-style filters for geography, identity context, verification state, services, payment, insurance, and access level.

Identity context is optional and source-qualified. The accepted quality modes are:

- self-identified
- family-confirmed
- source-confirmed
- unknown

## Public Shortcodes

The private WordPress implementation exposes these shortcodes:

| Shortcode | Purpose |
| --- | --- |
| `[clitz_galaxy_home]` | Public platform hub |
| `[clitz_map]` | Safe Leaflet/OpenStreetMap markers |
| `[clitz_directory]` | Public directory cards |
| `[clitz_submit_listing]` | Pending public submissions |
| `[clitz_reviews]` | Moderated reviews |
| `[clitz_mutual_aid]` | Mutual aid and fundraiser listings |
| `[clitz_moderation_dashboard]` | Trusted moderation dashboard |

## Safety Defaults

- Public submissions are pending by default.
- Private notes are never rendered publicly.
- Hidden and approximate locations do not expose exact coordinates.
- Exact public markers require explicit admin safety consent.
- Reviews require firsthand/hearsay disclosure and safety acknowledgments.
- Abuse, update, dispute, outdated, removal, import, and export actions create audit events.

## Legal Status

Legal pages are attorney-review placeholders. They must not be treated as final legal, medical, crisis, emergency, payment, or fundraiser advice.

