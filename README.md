# MMRDS
Maternal Mortality Review Data System

The Maternal Mortality Review and Data System (MMRDS) is a software tool created by CDC to collect, store, analyze and summarize information relevant to maternal deaths. The MMRDS serves 2 purposes: first to provide complete, detailed, and organized medical and social information that can be used by medical review committees to investigate individual maternal deaths; and second to provide a standardized cumulative database for future research and analysis on maternal mortality.


## Texas A&M Geoservices Geocoding APIs
This application uses the Texas A&M Geoservices Geocoding APIs <a href='http://geoservices.tamu.edu' target='_new'>http://geoservices.tamu.edu</a>


## Environment
+ [ASP.Net Core](https://docs.microsoft.com/en-us/aspnet/core/)
+ [Apache CouchDB](https://couchdb.apache.org/)


## Technology Stack
+ C#
+ Razor Syntax
+ HTML
+ CSS3
+ JavaScript, jQuery


## Updating meta-data values for Case Forms
1. Go to the [meta-data editor](http://localhost:5000/editor)
2. Locate and edit data you want to update (Hint: It helps to `ctrl+F` and find it)
3. Once updated, click *save metadata* button at the top twice
  - Ensure value in `_rev` increments for both times you clicked
4. Go to [meta-data version manager](http://localhost:5000/version-manager)
5. Select the version you want under *load version* drop down
6. Click *get version* under *load version*
7. Click *load latest metadata* under *edit attachments*
8. Click *#1 attach metadata* under *edit attachments*
9. If values prefill in form controls under *edit attachments*, then Done