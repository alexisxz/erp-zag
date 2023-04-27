# ZAG ERP - https://erp-zag.vercel.app/
A web app to be an ERP System to a medical company in Germany with the features:
1 - Create an "anfragen" (a purchase request)
2 - Create an "auftrag" (a purchase order)
3 - Manage warehouse (inbound, outbound and stock)



## Getting Started

First, set up you firebase config in the project;
Second, run the development server:

```bash
npm run dev
# or
yarn dev
```

## Techs
 - React / NextJs
 - Typescript
 - ESlint
 - Tailwind for styles
 - Firestore
 - Firebase Auth
 - XLSX (To Excel export)

### Pages
#### Login (index)
 - Admin login =
email: admin@email.com
password: adminpassword

 - Anfragen login = 
email: anfragen@email.com
password: anfragen

 - Auftrag login = 
email: auftrag@email.com
password: auftrag

 - Warehouse login = 
email: warehouse@email.com
password: warehouse

##### Panel
 - A welcome panel

#### Anfragen
 - You can create and manage your own anfragen

#### Auftrag
 - You can manage and create all auftrag based on anfragen
 
#### Warehouse
 - You can manage inbound, outbound and stock

#### APIS (To get all data)
 - /api/warehouse
 - /api/anfragen
 - /api/auftrag
 
 
 
