import { defineQuery } from "next-sanity";

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    brandName,
    eyebrow,
    "announcement": {
      "enabled": coalesce(announcementEnabled, false),
      "message": announcementMessage,
      "linkLabel": announcementLinkLabel,
      "linkUrl": announcementLinkUrl
    },
    headline,
    introduction,
    contactEmail,
    callToActionLabel,
    seoTitle,
    seoDescription
  }
`);
