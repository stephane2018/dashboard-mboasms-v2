export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MboaSMS",
    url: "https://mboasms.com",
    logo: "https://mboasms.com/images/logo.png",
    description:
      "Plateforme d'envoi de SMS professionnels au Cameroun avec API et services personnalisés pour entreprises et particuliers.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["French", "English"],
    },
    sameAs: [
      "https://twitter.com/mboasms",
      "https://www.linkedin.com/company/mboasms",
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function SoftwareApplicationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "MboaSMS",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://mboasms.com",
    description:
      "Plateforme d'envoi de SMS en masse au Cameroun. API SMS, marketing SMS, notifications et OTP.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "XAF",
      description: "Inscription gratuite, paiement à l'usage",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MboaSMS",
    url: "https://mboasms.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://mboasms.com/sms-pricing?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function FAQJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Comment envoyer des SMS en masse au Cameroun ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Inscrivez-vous sur MboaSMS, rechargez votre compte, importez vos contacts et lancez votre campagne SMS en quelques clics. Vous pouvez aussi utiliser notre API SMS pour automatiser vos envois.",
        },
      },
      {
        "@type": "Question",
        name: "Quel est le prix d'un SMS au Cameroun ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Le prix d'un SMS au Cameroun dépend du volume. Consultez notre page tarifs pour les prix détaillés par pays. Les tarifs dégressifs sont disponibles pour les gros volumes.",
        },
      },
      {
        "@type": "Question",
        name: "Comment obtenir un Sender ID personnalisé ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Créez votre Sender ID depuis votre tableau de bord MboaSMS. Fournissez les documents requis (KYC A2P et lettre d'autorisation) et votre Sender ID sera validé sous 24-48h.",
        },
      },
      {
        "@type": "Question",
        name: "MboaSMS propose-t-il une API SMS ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui, MboaSMS propose une API REST complète pour intégrer l'envoi de SMS dans vos applications. Documentation disponible sur mboasms.com/api-docs.",
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
