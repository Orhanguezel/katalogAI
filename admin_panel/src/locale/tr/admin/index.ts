import audit from './audit.json';
import auth from './auth.json';
import availability from './availability.json';
import bookings from './bookings.json';
import carriers from './carriers.json';
import categories from './categories.json';
import comingSoon from './coming-soon.json';
import common from './common.json';
import contacts from './contacts.json';
import dashboard from './dashboard.json';
import db from './db.json';
import emailTemplates from './email-templates.json';
import faqs from './faqs.json';
import ilanlar from './ilanlar.json';
import mail from './mail.json';
import notifications from './notifications.json';
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
import wallet from './wallet.json';

const adminMessages = {
  "audit": audit,
  "auth": auth,
  "availability": availability,
  "bookings": bookings,
  "carriers": carriers,
  "categories": categories,
  "comingSoon": comingSoon,
  "common": common,
  "contacts": contacts,
  "dashboard": dashboard,
  "db": db,
  "emailTemplates": emailTemplates,
  "faqs": faqs,
  "ilanlar": ilanlar,
  "mail": mail,
  "notifications": notifications,
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
  "wallet": wallet,
} as const;

export default adminMessages;
