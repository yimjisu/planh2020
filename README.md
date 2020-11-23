# planh2020

Made From React Template
https://www.wrappixel.com/templates/materialpro-react-admin-lite/

Lots of file are default files and some are not actually used in this project. 

Mainly edit .jsx files of src 

#### src>dashboard>projects.jsx 
* Card that shows routine is implemented in Project object
* Get information in firebase database, and show in fixed form
* information needed : title, user name, tags, routine info(list of action/time/info), rating, representative review
#### src>views>starter>starter.jsx 
* First Page and the page when user click 'Home' in sidebar
* Shows routine in 2 sections : my routine (routine that user wrote/able to edit), explore routines (routines written by other users/cannot edit)
* Click Read More Detail > goes to detail.jsx
* Click Read More (in Review) > goes to review.jsx
* Click Write (in Review) > goes to reviewWrite.jsx

### src>views>ui-components
We refer to files that contains template (e.g. alert.jsx, badge.jsx, button.jsx, popover.jsx, tooltip.jsx)

.jsx files we actually use
#### >detail.jsx
* Shows the routine in detail by placing it in full width
#### >level.jsx
* This page is shown when 'Check my Level' in sidebar is clicked
* User has to input for some questions.
* By answering several questions, we recommend appropriate level and according routines.
#### >review.jsx
* This page is shown when 'Read More' (in Review of routine card) is clicked
* Shows review according to the routine user clicked
* Can be sorted by only comments / only suggestions / newest / most upvotes
* like / unlike / report button can be clicked for each reviews
* Average rating is computed
* Data are all from firebase database : user name / comment / suggestion / rating / like number / unlike number 
#### >reviewWrite.jsx
* This page is shown when 'Write' (in Review of routine card) is clicked
* User can write their own review : comment or suggestion and rating in 5 contents
* rating : evaluate in 5 contents by controlling the sliders
* comment / suggestion : when user submit, it is uploaded into firebase database, and updated into review page.
#### >write.jsx
* This page is shown when 'Write' in sidebar is clicked
* User can easily write routine by text / picture
* Easily add tag or add actions by clicking button

#### >session.jsx
* This page is shown when 'Login' or 'Logout' in sidebar is clicked
* Page for authentication
* You can sign up or sign in or logout in this page
