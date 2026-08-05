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
    seoDescription,
    homepage{
      heroTitle,
      heroIntroduction,
      heroActionLabel,
      collectionTitle,
      guidanceEyebrow,
      guidanceTitle,
      guidanceIntroduction,
      guidanceActionLabel,
      guidanceSupportingText,
      "showServiceReassurance": coalesce(showServiceReassurance, true),
      serviceTitle,
      serviceIntroduction,
      "showFounderStory": coalesce(showFounderStory, true),
      founderTitle,
      founderStory,
      "founderImage": founderImage{
        "src": asset->url,
        alt
      },
      "showLongevity": coalesce(showLongevity, true),
      longevityTitle,
      longevityIntroduction,
      longevityConditions,
      "showCollectionInvitation": coalesce(showCollectionInvitation, true),
      collectionInvitationTitle,
      collectionInvitationIntroduction,
      collectionInvitationActionLabel
    }
  }
`);

export const EDITORIAL_PAGE_QUERY = defineQuery(`
  *[_type == "editorialPage" && slug.current == $slug][0]{
    eyebrow,
    title,
    introduction,
    "image": heroImage{
      "src": asset->url,
      alt
    },
    sections[]{
      heading,
      body
    },
    seoTitle,
    seoDescription
  }
`);
