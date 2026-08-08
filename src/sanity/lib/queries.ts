import { defineQuery } from "next-sanity";

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{ brandName, eyebrow, "announcement": { "enabled": coalesce(announcementEnabled, false), "message": announcementMessage, "linkLabel": announcementLinkLabel, "linkUrl": announcementLinkUrl }, headline, introduction, contactEmail, callToActionLabel, seoTitle, seoDescription, homepage{ heroTitle, heroIntroduction, heroActionLabel, "heroSlides": heroSlides[visible != false]{ "id": _key, "src": image.asset->url, "hotspot": image.hotspot, alt, caption }, collectionTitle, guidanceEyebrow, guidanceTitle, guidanceIntroduction, guidanceActionLabel, guidanceSupportingText, "showServiceReassurance": coalesce(showServiceReassurance, true), serviceTitle, serviceIntroduction, "showFounderStory": coalesce(showFounderStory, true), founderTitle, founderStory, "founderImage": founderImage{ "src": asset->url, alt }, "showLongevity": coalesce(showLongevity, true), longevityTitle, longevityIntroduction, longevityConditions, "showCollectionInvitation": coalesce(showCollectionInvitation, true), collectionInvitationTitle, collectionInvitationIntroduction, collectionInvitationActionLabel } }
`);

export const EDITORIAL_PAGE_QUERY = defineQuery(`
  *[_type == "editorialPage" && slug.current == $slug][0]{
    eyebrow, title, introduction, "image": heroImage{ "src": asset->url, alt },
    sections[]{ _key, role, heading, body, "image": image{ "src": asset->url, alt, storefrontRightsConfirmed, hotspot, crop } },
    seoTitle, seoDescription
  }
`);

export const GALLERY_PAGE_QUERY = defineQuery(`
  *[_type == "editorialPage" && slug.current == "gallery"][0]{
    title,
    introduction,
    sections[]{
      _key,
      galleryGroup,
      heading,
      body,
      "image": image{
        "src": asset->url,
        alt,
        storefrontRightsConfirmed,
        hotspot,
        crop,
        "dimensions": asset->metadata.dimensions{
          width,
          height,
          aspectRatio
        }
      }
    },
    seoTitle,
    seoDescription
  }
`);
