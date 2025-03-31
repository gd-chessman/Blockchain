import { useTranslations } from "next-intl"

export default function Home({ params }: { params: { locale: string } }) {
  const t = useTranslations()

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  )
}
