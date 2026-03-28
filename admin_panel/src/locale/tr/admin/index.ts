import audit from './audit.json';
import auth from './auth.json';
import catalogs from './catalogs.json';
import categories from './categories.json';
import comingSoon from './coming-soon.json';
import common from './common.json';
import contacts from './contacts.json';
import dashboard from './dashboard.json';
import db from './db.json';
import emailTemplates from './email-templates.json';
import faqs from './faqs.json';
import mail from './mail.json';
import notifications from './notifications.json';
import productSources from './product-sources.json';
import reports from './reports.json';
import reviews from './reviews.json';
import services from './services.json';
import sidebar from './sidebar.json';
import siteSettings from './site-settings.json';
import storage from './storage.json';
import telegram from './telegram.json';
import theme from './theme.json';
import userRoles from './user-roles.json';
import users from './users.json';

const adminMessages = {
  "audit": audit,
  "auth": auth,
  "catalogs": catalogs,
  "categories": categories,
  "comingSoon": comingSoon,
  "common": common,
  "contacts": contacts,
  "dashboard": dashboard,
  "db": db,
  "emailTemplates": emailTemplates,
  "faqs": faqs,
  "mail": mail,
  "notifications": notifications,
  "productSources": productSources,
  "reports": reports,
  "reviews": reviews,
  "services": services,
  "sidebar": sidebar,
  "siteSettings": siteSettings,
  "storage": storage,
  "telegram": telegram,
  "theme": theme,
  "userRoles": userRoles,
  "users": users,
} as const;

export default adminMessages;
