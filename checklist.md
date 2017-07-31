![Cheil Worldwide logo](http://www.cheil.com/web/images/common/logo.png)

#Project Checklist

## Informations

+ Chef de projet: ______
+ Lead Front-end: ________
+ Front-end : ________

Published on: 10 September 2016

+ Page link: [http://www.samsung.com/fr/](http://www.samsung.com/fr/)
+ GitHub link: [http://www.samsung.com/fr/](http://www.samsung.com/fr/)


##Do

Frontend developers **must**:

- [x] Always comment their code
- [x] Prefix their CSS
- [x] Declare JS variables and functions into Cheil object
- [x] Put JS at bottom
- [ ] Use page state persistance (#!)
- [ ] Add Google Analytics & SiteCatalyst
- [x] Minify JS / CSS
- [x] Optimize Images
- [ ] Add *alt* tags on Images
- [ ] Add a breadcrumb [ accueil > dossier > page ]
- [ ] Use *rel* tag in pagination
- [ ] take extra care when using *noFollow* tag or cookies
- [ ] Use proper social sharing [desktop, mobile] and meta tags
- [ ] Use SAMSUNG France youtube channel for video streams

##Don't

Microsites **cannot** have:

- iFrames
- JS templates
- files > 20Mb
- Forms
- Files other than html, js, json, css, images, svg

##Optimization

Microsites **must**:

- [ ] Pass [W3C Check](https://validator.w3.org/#validate_by_uri) 
- [ ] Score > 80/100 on [Pagespeed](https://developers.google.com/speed/pagespeed/insights/)


##Compatibility

####Desktop\*

- [ ] IE 11 
- [ ] Edge
- [ ] Safari
- [ ] Chrome
- [ ] Firefox

####Tablets\*

- [ ] Samsung Galaxy Tab 
- [ ] Samsung Galaxy Tab S
- [ ] iPad

####Smartphones\*

- [ ] Samsung S 
- [ ] Samsung Galaxy
- [ ] Samsung Galaxy Note
- [ ] Samsung Galaxy ACE 
- [ ] Samsung Galaxy A
- [ ] iPhone

\* Last device version until n-2, if microsite isn't compatible for technical reasons, you should show an alert inviting users to download a different browser.


##Deploying

- [ ] Code Review by @
- [ ] Security check by Samsung

####Deployed on:

- [x] Local 
- [ ] Staging
- [ ] Production 
