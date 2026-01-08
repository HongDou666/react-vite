import { withTranslation } from 'react-i18next'

const I18nChild1 = ({ t }) => {
  return <div>{t('simpleText')}</div>
}

export default withTranslation()(I18nChild1)
