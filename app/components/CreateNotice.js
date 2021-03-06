import React from 'react';
import ReactDOM from 'react-dom';
import Notice from './NoticeBoard/Notice.js';                       /* Notice Preview */
import NoticeEvent from './NoticeBoard/NoticeEvent.js';             /* Event Preview */
import NoticeSurvey from './NoticeBoard/NoticeSurvey.js';           /* Survey Preview */
import $ from 'jquery';                                             /* For ajax query */
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';          /* https://github.com/reactjs/react-tabs */
import moment from "moment";                                        /* https://momentjs.com/ */
import DatePicker from 'react-datepicker';                          /* https://github.com/Hacker0x01/react-datepicker */
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-bootstrap-time-picker';               /* https://github.com/yury-dymov/react-bootstrap-time-picker */

import { WithContext as ReactTags } from 'react-tag-input';


var mysurveyItems = [];     // Array of Comonents
var mysurveyCount = 0;
var Questions = [];         //Questions.push({questionNo: qNumber, answerType: qType, question: value});
var Answers = [];           //Answers.push({aNum: aNumber, questionNo: qNumber, answer: value, AnswerID: answerID});

var groupID = [];           // Used to store suggested Groups w/ id's for submitting
var busID = [];

class create_notice extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            GroupTags: [],
            GroupSuggestions: [],
            BusTags: [],
            BusSuggestions: [],

            NTitle: "",
            NContent: "",
            Nemail: "off",
            NChambers: "off",
            NChambersChild: "off",

            ETitle: "",
            EContent: "",
            EStartDate: "",
            EendDate: "",
            EStart: "61200",
            Eend: "64800",
            Elocation: "",
            Elink: "",
            Eemail: "off",
            EChambers: "off",
            EChambersChild: "off",

            STitle: "",
            SItems: [],
            SChange: "",
            Semail: "off",
            SChambers: "off",
            SChambersChild: "off"
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
        this.submitNotice = this.submitNotice.bind(this);
        this.submitEvent = this.submitEvent.bind(this);
        this.submitSurvey = this.submitSurvey.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.remQuestion = this.remQuestion.bind(this);
        this.handleAnswerReturn = this.handleAnswerReturn.bind(this);
        this.handleQuestionReturn = this.handleQuestionReturn.bind(this);
        this.getQuestionIndex = this.getQuestionIndex.bind(this);
        this.getAnswerIndex = this.getAnswerIndex.bind(this);
        this.updatePrev = this.updatePrev.bind(this);
        this.handleDayStart = this.handleDayStart.bind(this);
        this.handleDayEnd = this.handleDayEnd.bind(this);
        this.handleTimeStart = this.handleTimeStart.bind(this);
        this.handleTimeEnd = this.handleTimeEnd.bind(this);

        this.GrouphandleDelete = this.GrouphandleDelete.bind(this);
        this.GrouphandleAddition = this.GrouphandleAddition.bind(this);
        this.GrouphandleDrag = this.GrouphandleDrag.bind(this);
        this.BushandleDelete = this.BushandleDelete.bind(this);
        this.BushandleAddition = this.BushandleAddition.bind(this);
        this.BushandleDrag = this.BushandleDrag.bind(this);

        this.getAvailableGroups = this.getAvailableGroups.bind(this);
        this.getAllBusiness = this.getAllBusiness.bind(this);
        this.surveyReset = this.surveyReset.bind(this);


        moment.locale("en-au");
    }

    componentWillMount() {
        this.getAvailableGroups();
        this.getAllBusiness();
        this.surveyReset()
    }

    surveyReset(){
        var count = mysurveyItems.length + 1;
        for (var i=0; i < count; i++){
            this.remQuestion();
        }
        this.setState({
            STitle: "",
            SItems: []
        });
        this.updatePrev();
    }

    /* Generic function for most text areas */
    handleChange(event){
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
    }

    handleChangeCheckbox(event){    // Checkboxes for emails across all tabs
        const name = event.target.name;
        const value = event.target.value;

        if(this.state[name] == "off"){
            this.setState({[name]: "on"});
        }
        else{
            this.setState({[name]: "off"});
        }
    }

    handleDayStart(date){           //Event Start Date (datePicker)
        this.setState({
            EStartDate: date
        });
    }
    handleDayEnd(date){             //Event End Date  (datePicker)
        this.setState({
            EendDate: date
        });
    }
    handleTimeStart(date){          //Event start Time (timePicker)
        this.setState({
            EStart: date
        });
    }
    handleTimeEnd(date){            //Event end Time (timePicker)
        this.setState({
            Eend: date
        });
    }

    //** Group Tags **//
    GrouphandleDelete(i) {
      let tags = this.state.GroupTags;
      var deleted = tags[i]['text'];
      tags.splice(i, 1);
    }
    GrouphandleAddition(tag) {
      let tags = this.state.GroupTags;
      var existing = false;
      tags.forEach((existingTag) => {
        if(existingTag['text'] === tag)
          existing = true;
      });
      if(!existing){

        var inSuggestions = false;
        this.state.GroupSuggestions.forEach((suggestion) => {
          if(suggestion === tag)
            inSuggestions = true;
        });
        if(inSuggestions){
            tags.push({
              id: tags.length + 1,
              text: tag
            });
        }
        else {
            alert("That group doesnt exist! You can create a new group using the 'Manage Groups' page")
        }
      }
    }
    GrouphandleDrag(tag, currPos, newPos) {
      //Do nothing, function is required but there is no point to rearranging.
    }

    //** Business Tags **//
    BushandleDelete(i) {
      let tags = this.state.BusTags;
      var deleted = tags[i]['text'];
      tags.splice(i, 1);
    }
    BushandleAddition(tag) {
      let tags = this.state.BusTags;
      var existing = false;
      tags.forEach((existingTag) => {
        if(existingTag['text'] === tag)
          existing = true;
      });
      if(!existing){
        var inSuggestions = false;
        this.state.BusSuggestions.forEach((suggestion) => {
          if(suggestion === tag)
            inSuggestions = true;
        });
        if(inSuggestions){
            tags.push({
              id: tags.length + 1,
              text: tag
            });
        }
        else {
            alert("That business doesnt exist!")
        }
      }
    }
    BushandleDrag(tag, currPos, newPos) {
      //Do nothing, function is required but there is no point to rearranging.
    }

    // Fetches the available groups from the database to use as suggestions
    getAvailableGroups() {
        $.ajax({url: "/php/get_chamber_groups.php", success: result => {
        if (result !== '') {
          var results = JSON.parse(result);
          var groupNames = [];
          results.forEach((item) => {
            groupNames.push(item['name']);
            groupID.push({name: item['name'], groupID: item['groupID']});
          });
          this.setState({GroupSuggestions: groupNames});
        }
        }});
    }

    getAllBusiness() {
        $.ajax({url: "/php/get_chamber_business.php", success: result => {
          if (result !== '') {
            var results = JSON.parse(result);
            var groupNames = [];
            results.forEach((item) => {
              groupNames.push(item['businessname']);
              busID.push({name: item['businessname'], groupID: item['businessID']});
            });
            this.setState({BusSuggestions: groupNames});
          }
        }});
    }

    /* Post the notice to the DB */
    submitNotice(){
        if((this.state.NTitle == "") || (this.state.NContent == "")){
            window.alert("That notification has blank fields! Please enter a title and content");
        }
        else if ((this.state.NChambers == "off") && (this.state.NChambersChild == "off") && (this.state.GroupTags.length == 0) && (this.state.BusTags.length == 0)){
            window.alert("Please choose at least one recipient!");
        }
        else{
            // Get the ID's from our Groups and Businesses
            var groups = [];
            for (var i=0; i < this.state.GroupTags.length; i++){
                for (var b=0; b < groupID.length; b++){
                    if (this.state.GroupTags[i].text == groupID[b].name){
                        groups.push(groupID[b].groupID);
                    }
                }
            }
            var bus = [];
            for (var i=0; i < this.state.BusTags.length; i++){
                for (var b=0; b < busID.length; b++){
                    if (this.state.BusTags[i].text == busID[b].name){
                        bus.push(busID[b].groupID);
                    }
                }
            }

            $.ajax({
                url: '/php/insert_notification.php',
                type:'POST',
                async: false,
                dataType: "json",
                data:{
                    'title': this.state.NTitle,
                    'content': this.state.NContent,
                    'postChamber' : this.state.NChambers,
                    'postChild' : this.state.NChambersChild,
                    'groups' : groups,
                    'business' : bus
                },
                success : function(response){
                    alert("Notification successfully posted");
                    this.setState({
                        NTitle: "",
                        NContent: ""
                    });
                }.bind(this)
            });

            //If email option selected, do email blast
            if (this.state.Nemail == "on"){
                var emails = [];
                $.ajax({
                    url: '/php/get_Emails.php',
                    type:'POST',
                    async: false,
                    dataType: "json",
                    data:{
                        'postChamber' : this.state.NChambers,
                        'groups' : groups,
                        'business' : bus
                    },
                    success : function(response){
                        emails = response;
                    }.bind(this)
                });
                window.location = 'mailto:?bcc=' + emails + '&subject=New Chamber Notice: ' + this.state.NTitle + '&body=' + this.state.NContent;
            }

        }

    }
    submitEvent(){
        if((this.state.ETitle == "") || (this.state.EContent == "") || (this.state.EStartDate == "") || (this.state.EendDate == "") || (this.state.Elocation == "")){
            window.alert("That event has blank fields! Please fill in the missing fields");
        }
        else if ((this.state.EChambers == "off") && (this.state.EChambersChild == "off") && (this.state.GroupTags.length == 0) && (this.state.BusTags.length == 0)){
            window.alert("Please choose at least one recipient!");
        }
        else{
            var groups = [];
            for (var i=0; i < this.state.GroupTags.length; i++){
                for (var b=0; b < groupID.length; b++){
                    if (this.state.GroupTags[i].text == groupID[b].name){
                        groups.push(groupID[b].groupID);
                    }
                }
            }
            var bus = [];
            for (var i=0; i < this.state.BusTags.length; i++){
                for (var b=0; b < busID.length; b++){
                    if (this.state.BusTags[i].text == busID[b].name){
                        bus.push(busID[b].groupID);
                    }
                }
            }

            var sdate = moment(moment(this.state.EStartDate).add(this.state.EStart, 'seconds')).format();
            var edate = moment(moment(this.state.EendDate).add(this.state.Eend, 'seconds')).format();
            $.ajax({
                url: '/php/insert_event.php',
                type:'POST',
                //async: false,
                dataType: "json",
                data:{
                    'title': this.state.ETitle,
                    'content': this.state.EContent,
                    'sDate' : sdate,
                    'eDate' : edate,
                    'location' : this.state.Elocation,
                    'link' : this.state.Elink,
                    'postChamber' : this.state.EChambers,
                    'postChild' : this.state.EChambersChild,
                    'groups' : groups,
                    'business' : bus
                },
                success : function(response){
                    alert("Event successfully posted");
                    //If email option selected, do email blast
                    if (this.state.Eemail == "on"){
                        this.emailEvent(response, groups, bus)
                    }else {
                        this.setState({
                            ETitle: "",
                            EContent: "",
                            EStartDate: "",
                            EendDate: "",
                            Elocation: "",
                            Elink: ""
                        });
                    }
                }.bind(this)
            });
        }
    }
    emailEvent(eventID, groups, bus){
        var emails = [];
        $.ajax({
            url: '/php/get_Emails.php',
            type:'POST',
            async: false,
            dataType: "json",
            data:{
                'postChamber' : this.state.EChambers,
                'groups' : groups,
                'business' : bus
            },
            success : function(response){
                emails = response;
            }.bind(this)
        });
        window.location = 'mailto:?bcc=' + emails
            + '&subject=New Chamber Event: '+ this.state.ETitle
            + '&body=' + 'You have a new event available, to RSVP, go to https://slaterchamber.com?event=' + eventID + '%0D%0A' + '%0D%0A'
            + 'Details: ' + this.state.EContent + '%0D%0A'
            + 'When: ' + moment(moment(this.state.EStartDate).add(this.state.EStart, 'seconds')).format('dddd MMMM Do YYYY, h:mm a') + ' to ' + moment(moment(this.state.EendDate).add(this.state.Eend, 'seconds')).format('MMMM Do YYYY, h:mm a') + '%0D%0A'
            + 'Where: ' + this.state.Elocation + '%0D%0A'
            + 'Link: ' + this.state.Elink;
        this.setState({
            ETitle: "",
            EContent: "",
            EStartDate: "",
            EendDate: "",
            Elocation: "",
            Elink: ""
        });
    }

    submitSurvey(){
        if((this.state.STitle == "") || (Questions.length == 0)){
            window.alert("That Survey has blank fields! Please ensure there is a title and at least 1 question");
        }
        else if ((this.state.SChambers == "off") && (this.state.SChambersChild == "off") && (this.state.GroupTags.length == 0) && (this.state.BusTags.length == 0)){
            window.alert("Please choose at least one recipient!");
        }
        else{
            var groups = [];
            for (var i=0; i < this.state.GroupTags.length; i++){
                for (var b=0; b < groupID.length; b++){
                    if (this.state.GroupTags[i].text == groupID[b].name){
                        groups.push(groupID[b].groupID);
                    }
                }
            }
            var bus = [];
            for (var i=0; i < this.state.BusTags.length; i++){
                for (var b=0; b < busID.length; b++){
                    if (this.state.BusTags[i].text == busID[b].name){
                        bus.push(busID[b].groupID);
                    }
                }
            }
            $.ajax({
                url: '/php/insert_Survey.php',
                type:'POST',
                dataType: "json",
                async: false,
                data:{
                    'title': this.state.STitle,
                    'questions': Questions,
                    'answers' : Answers,
                    'postChamber' : this.state.SChambers,
                    'postChild' : this.state.SChambersChild,
                    'groups' : groups,
                    'business' : bus
                },
                success : function(response){
                    alert("Survey successfully posted");
                    //If email option selected, do email blast
                    if (this.state.Semail == "on"){
                        this.emailSurvey(response, groups, bus)
                    }else {
                        this.surveyReset();
                    }
                }.bind(this)
            });
        }
    }
    emailSurvey(surveyID, groups, bus){
        var emails = [];
        $.ajax({
            url: '/php/get_Emails.php',
            type:'POST',
            async: false,
            dataType: "json",
            data:{
                'postChamber' : this.state.SChambers,
                'groups' : groups,
                'business' : bus
            },
            success : function(response){
                emails = response;
            }.bind(this)
        });
        window.location = 'mailto:?bcc=' + emails
            + '&subject=New Chamber Survey: '+ this.state.STitle
            + '&body=' + 'You have a new Survey available, to complete, go to https://slaterchamber.com?survey=' + surveyID;
    }

    addQuestion(){
        // Survey: Add a blank question to the screen
        mysurveyItems.push(<Question
            key={mysurveyCount}
            count={mysurveyCount + 1}
            handleReturn={this.handleAnswerReturn}
            handleQReturn={this.handleQuestionReturn}
            updatePrev={this.updatePrev}
        />)
        mysurveyCount++;
        this.setState({SItems: mysurveyItems});
        this.updatePrev();
    }

    remQuestion(){
        // Survey: Remove the question from the submission array
        var index = this.getQuestionIndex(mysurveyCount);
        if (index != -1){
            Questions.splice(index,1);
        }
        // Remove the answers fromt the submission array
        RemoveAnswers(mysurveyCount);

        // Remove the question from the display
        mysurveyItems.pop()
        mysurveyCount--;
        this.setState({SItems: mysurveyItems});
        this.updatePrev();
    }

    /* Survey: A new answer has been passed back up  */
    handleAnswerReturn(value, aNumber, qNumber){
        // See if its already got a record in the submissions array
        var index = this.getAnswerIndex(aNumber,qNumber);

        // Find the Q# A# that matches, if no match push new
        if (index == -1){
            Answers.push({aNum: aNumber, questionNo: qNumber, answer: value, AnswerID: value+qNumber});
        }
        else{
            Answers[index].answer = value;
        }
    }

    /* Survey: A new Question has been passed back up */
    handleQuestionReturn(value, qNumber, qType){
        // See if its already got a record in the submissions array
        var index = this.getQuestionIndex(qNumber);

        // Find the Q# that matches, if no match push new
        if (index == -1){
            Questions.push({questionNo: qNumber, answerType: qType, question: value});
        }
        else{
            Questions[index].question = value;
            Questions[index].answerType = qType;
        }
    }

    /* Survey: Submission Array Answers and Questions Search functions */
    getAnswerIndex(aNumber, qNumber) {
        for(var i = 0; i < Answers.length; i++) {
            if((Answers[i]['aNum'] == aNumber) & (Answers[i]['questionNo'] == qNumber)) {
                return i;
            }
        }
        return -1;
    }
    getQuestionIndex(qNumber){
        for(var i = 0; i < Questions.length; i++) {
            if(Questions[i]['questionNo'] == qNumber) {
                return i;
            }
        }
        return -1;
    }

    updatePrev(){
        // Used only to update the survey preview by modifying props
        if (this.state.SChange == "0"){
            this.setState({
                SChange: "1"
            });
        }
        else{
            this.setState({
                SChange: "0"
            });
        }
    }

    render() {
    return(
        <div className="main-component w3-row">
        <div className='w3-container w3-card-4 w3-light-grey'>
        <h2>Create a new Notice, Event or Survey</h2>
        <Tabs>
            <TabList>
                <Tab>New Notice</Tab>
                <Tab>New Event</Tab>
                <Tab>New Survey</Tab>
            </TabList>

            <TabPanel>  {/******************************************** Notifications *********************************************************************** */}
                <div className="w3-row">
                    <div><h3>Enter the notice details below:</h3></div>
                    <div className="w3-col s3">
                        <div className="CreateNoticeDiv"><label>Notice Title:</label></div>
                        <div className="CreateNoticeDiv"><label>Notice Content:</label></div>
                    </div>
                    <div className="w3-col s9 CreateNoticeDiv">
                        <div className="CreateNoticeDiv"><input type="text" name="NTitle" placeholder="My Title" value={this.state.NTitle} onChange={this.handleChange}/></div>
                        <div className="CreateNoticeDiv"><textarea rows="5" name="NContent" placeholder="My Message Content" value={this.state.NContent} onChange={this.handleChange}></textarea></div>
                    </div>
                </div>
                <div>
                    <div><h3>Preview:</h3></div>
                     <Notice
                         key="PrevNotice"
                         title={this.state.NTitle}
                         message={this.state.NContent}
                         DatePosted=""
                     />
                </div>
                <div>
                    <div><h3>Choose Recipients:</h3></div>

                    <div className="w3-col s3 CreateNoticeDiv"><div><label>My Chamber:</label></div></div>
                    <div className="w3-col s9" title="Display notice to all chamber members"><label className="switch"><input type="checkbox" name="NChambers" onChange={this.handleChangeCheckbox}/><span className="slider round"></span></label></div>

                    <div className="w3-col s3 CreateNoticeDiv"><div><label>Offer to child Chambers:</label></div></div>
                    <div className="w3-col s2" title="Allow child chambers to view this notice if they choose"><label className="switch"><input type="checkbox" name="NChambersChild" onChange={this.handleChangeCheckbox}/><span className="slider round"></span></label></div>
                    <div className="w3-col s7 CreateNoticeDiv"><div><label>* You can give child chambers to option to see this notification, but an executive of that chamber will have to approve it before is shown to their chamber members</label></div></div>

                    <div className="w3-col s3 CreateNoticeDiv"><div><label>Add Groups:</label></div></div>
                    <div className="w3-col s9 CreateNoticeDiv">
                        <ReactTags
                          tags={this.state.GroupTags}
                          suggestions={this.state.GroupSuggestions}
                          handleDelete={this.GrouphandleDelete}
                          handleAddition={this.GrouphandleAddition}
                          handleDrag={this.GrouphandleDrag}
                          autocomplete={true}
                          allowDeleteFromEmptyInput={false}
                          placeholder={'Add Group'}
                        />
                    </div>

                    <div className="w3-col s3 CreateNoticeDiv"><div><label>Add Business:</label></div></div>
                    <div className="w3-col s9 CreateNoticeDiv">
                        <ReactTags
                          tags={this.state.BusTags}
                          suggestions={this.state.BusSuggestions}
                          handleDelete={this.BushandleDelete}
                          handleAddition={this.BushandleAddition}
                          handleDrag={this.BushandleDrag}
                          autocomplete={true}
                          allowDeleteFromEmptyInput={false}
                          placeholder={'Add Business'}
                        />
                    </div>

                </div>
                <div className="event-buttons">
                    <div className="w3-row">
                        <div className="w3-col s6" id="CreateNoticeEmail"><label>Email to all</label></div>
                        <div className="w3-col s6" id="CreateNoticeEmailSwitch" title="Selecting email to all will send an email to all selected groups as well as display it on their home page"><label className="switch"><input type="checkbox" name="Nemail" onChange={this.handleChangeCheckbox}/><span className="slider round"></span></label></div>
                    </div>
                    <div><button type="button" className="btn btn-primary" id="btnSubmitNotice" onClick={this.submitNotice}>Submit</button></div>
                </div>
            </TabPanel>
            <TabPanel>  {/******************************************** EVENTS *********************************************************************** */}
                <div className="w3-row">
                    <div><h3>Enter the event details below:</h3></div>
                    <div className="w3-col s3 CreateNoticeDiv"><div><label>Event Title:</label></div></div>
                    <div className="w3-col s9 CreateNoticeDiv"> <div><input type="text" name="ETitle" placeholder="My Title" value={this.state.ETitle} onChange={this.handleChange}/></div></div>

                    <div className="w3-col s3 CreateNoticeDiv"><div><label>Event Content:</label></div></div>
                    <div className="w3-col s9 CreateNoticeDiv"><div><textarea rows="5" name="EContent" placeholder="My Event Details" value={this.state.EContent} onChange={this.handleChange}></textarea></div></div>

                    <div className="w3-col s3 CreateNoticeDiv"><div><label>Start Date:</label></div></div>
                    <div className="w3-col s9 CreateNoticeDiv"><div><DatePicker name="EStartDate" placeholderText="DD/MM/YYYY" selected={this.state.EStartDate} onChange={this.handleDayStart} minDate={moment()} maxDate={moment().add(5, "years")}/></div></div>

                    <div className="w3-col s3 CreateNoticeDiv"><div><label>End Date:</label></div></div>
                    <div className="w3-col s9 CreateNoticeDiv"><div><DatePicker name="EendDate" placeholderText="DD/MM/YYYY" selected={this.state.EendDate} onChange={this.handleDayEnd} minDate={moment()} maxDate={moment().add(5, "years")}/></div></div>

                    <div className="w3-col s3 CreateNoticeDiv"><div><label>Start Time:</label></div></div>
                    <div className="w3-col s9 CreateNoticeDiv"><div><TimePicker onChange={this.handleTimeStart} value={this.state.EStart} step={30} initialValue={61200}/></div></div>

                    <div className="w3-col s3 CreateNoticeDiv"><div><label>End Time:</label></div></div>
                    <div className="w3-col s9 CreateNoticeDiv"> <div><TimePicker onChange={this.handleTimeEnd} value={this.state.Eend} step={30} initialValue={64800}/></div></div>

                    <div className="w3-col s3 CreateNoticeDiv"><div><label>Location:</label></div></div>
                    <div className="w3-col s9 CreateNoticeDiv"> <div><input type="text" name="Elocation" placeholder="Event Location" value={this.state.Elocation} onChange={this.handleChange}/></div></div>

                    <div className="w3-col s3 CreateNoticeDiv"><div><label>Link:</label></div></div>
                    <div className="w3-col s9 CreateNoticeDiv"> <div><input type="text" name="Elink" placeholder="" value={this.state.Elink} onChange={this.handleChange}/></div></div>
                </div>
                <div>
                    <div><h3>Preview:</h3></div>
                    <NoticeEvent
                        key="PrevEvent"
                        eventID=""
                        title={this.state.ETitle}
                        message={this.state.EContent}
                        eventdate={moment(this.state.EStartDate).add(this.state.EStart, 'seconds')}
                        endTime={moment(this.state.EendDate).add(this.state.Eend, 'seconds')}
                        location={this.state.Elocation}
                        EventURL={this.state.Elink}
                        DatePosted=""
                        Disabled={true}
                    />
                </div>
                <div>
                    <div><h3>Choose Recipients:</h3></div>

                    <div className="w3-col s3 CreateNoticeDiv"><div><label>My Chamber:</label></div></div>
                    <div className="w3-col s9" title="Display notice to all chamber members"><label className="switch"><input type="checkbox" name="EChambers" onChange={this.handleChangeCheckbox}/><span className="slider round"></span></label></div>

                    <div className="w3-col s3 CreateNoticeDiv"><div><label>Offer to child Chambers:</label></div></div>
                    <div className="w3-col s2" title="Allow child chambers to view this notice if they choose"><label className="switch"><input type="checkbox" name="EChambersChild" onChange={this.handleChangeCheckbox}/><span className="slider round"></span></label></div>
                    <div className="w3-col s7 CreateNoticeDiv"><div><label>* You can give child chambers to option to see this event, but an executive of that chamber will have to approve it before is offered to their chamber members</label></div></div>

                    <div className="w3-col s3 CreateNoticeDiv"><div><label>Add Groups:</label></div></div>
                    <div className="w3-col s9 CreateNoticeDiv">
                        <ReactTags
                          tags={this.state.GroupTags}
                          suggestions={this.state.GroupSuggestions}
                          handleDelete={this.GrouphandleDelete}
                          handleAddition={this.GrouphandleAddition}
                          handleDrag={this.GrouphandleDrag}
                          autocomplete={true}
                          allowDeleteFromEmptyInput={false}
                          placeholder={'Add Group'}
                        />
                    </div>

                    <div className="w3-col s3 CreateNoticeDiv"><div><label>Add Business:</label></div></div>
                    <div className="w3-col s9 CreateNoticeDiv">
                        <ReactTags
                          tags={this.state.BusTags}
                          suggestions={this.state.BusSuggestions}
                          handleDelete={this.BushandleDelete}
                          handleAddition={this.BushandleAddition}
                          handleDrag={this.BushandleDrag}
                          autocomplete={true}
                          allowDeleteFromEmptyInput={false}
                          placeholder={'Add Business'}
                        />
                    </div>

                </div>
                <div className="event-buttons">
                    <div className="w3-row">
                        <div className="w3-col s6" id="CreateNoticeEmail"><label>Email to all</label></div>
                        <div className="w3-col s6" id="CreateNoticeEmailSwitch" title="Selecting email to all will send an email to all selected groups as well as display it on their home page"><label className="switch"><input type="checkbox" name="Eemail" onChange={this.handleChangeCheckbox}/><span className="slider round"></span></label></div>
                    </div>
                    <div><button type="button" className="btn btn-primary" id="btnSubmitEvent" onClick={this.submitEvent}>Submit</button></div>
                </div>
            </TabPanel>
            <TabPanel>  {/******************************************** SURVEYS *********************************************************************** */}
                <div className="w3-row">
                    <div><h3>Enter the Surveys Questions and Answers below:</h3></div>
                    <div className="w3-col s3 CreateNoticeDiv"><div><label>Survey Title:</label></div></div>
                    <div className="w3-col s9 CreateNoticeDiv"> <div><input type="text" name="STitle" placeholder="My Title" value={this.state.STitle} onChange={this.handleChange}/></div></div>

                    {this.state.SItems.map((item, i) =>
                     <div key={i}>
                       {item}
                     </div>
                    )}

                    <div className="event-buttons">
                        <button type="button" className="btn btn-success" id="btnAddQA" onClick={this.addQuestion}>Add Question</button>
                        <button type="button" className="btn btn-danger" id="btnRemQA" onClick={this.remQuestion}>Remove Question</button>
                    </div>

                </div>
                <div>
                    <div><h3>Preview:</h3></div>
                    <NoticeSurvey
                        key="PrevSurvey"
                        SurveyID=""
                        title={this.state.STitle}
                        DatePosted={moment()}
                        Disabled={true}
                        Questions={Questions}
                        Answers={Answers}
                        Change={this.state.SChange}
                    />
                </div>
                <div>
                    <div><h3>Choose Recipients:</h3></div>

                    <div className="w3-col s3 CreateNoticeDiv"><div><label>My Chamber:</label></div></div>
                    <div className="w3-col s9" title="Display notice to all chamber members"><label className="switch"><input type="checkbox" name="SChambers" onChange={this.handleChangeCheckbox}/><span className="slider round"></span></label></div>

                    <div className="w3-col s3 CreateNoticeDiv"><div><label>Offer to child Chambers:</label></div></div>
                    <div className="w3-col s2" title="Allow child chambers to view this notice if they choose"><label className="switch"><input type="checkbox" name="SChambersChild" onChange={this.handleChangeCheckbox}/><span className="slider round"></span></label></div>
                    <div className="w3-col s7 CreateNoticeDiv"><div><label>* You can give child chambers to option to see this notification, but an executive of that chamber will have to approve it before is shown to their chamber members</label></div></div>

                    <div className="w3-col s3 CreateNoticeDiv"><div><label>Add Groups:</label></div></div>
                    <div className="w3-col s9 CreateNoticeDiv">
                        <ReactTags
                          tags={this.state.GroupTags}
                          suggestions={this.state.GroupSuggestions}
                          handleDelete={this.GrouphandleDelete}
                          handleAddition={this.GrouphandleAddition}
                          handleDrag={this.GrouphandleDrag}
                          autocomplete={true}
                          allowDeleteFromEmptyInput={false}
                          placeholder={'Add Group'}
                        />
                    </div>

                    <div className="w3-col s3 CreateNoticeDiv"><div><label>Add Business:</label></div></div>
                    <div className="w3-col s9 CreateNoticeDiv">
                        <ReactTags
                          tags={this.state.BusTags}
                          suggestions={this.state.BusSuggestions}
                          handleDelete={this.BushandleDelete}
                          handleAddition={this.BushandleAddition}
                          handleDrag={this.BushandleDrag}
                          autocomplete={true}
                          allowDeleteFromEmptyInput={false}
                          placeholder={'Add Business'}
                        />
                    </div>

                </div>
                <div className="event-buttons">
                    <div className="w3-row">
                        <div className="w3-col s6" id="CreateNoticeEmail"><label>Email to all</label></div>
                        <div className="w3-col s6" id="CreateNoticeEmailSwitch" title="Selecting email to all will send an email to all selected groups as well as display it on their home page"><label className="switch"><input type="checkbox" name="Semail" onChange={this.handleChangeCheckbox}/><span className="slider round"></span></label></div>
                    </div>
                    <div><button type="button" className="btn btn-primary" id="btnSubmitSurvey" onClick={this.submitSurvey}>Submit</button></div>
                </div>
            </TabPanel>
        </Tabs>
      </div>
      </div>
    );
  }


};
export default create_notice;

/* Used only by Surveys */
class Question extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          question: "",
          questionType: 0,      // Default Radio
          answers: [],
          answersCount: 0,
          hide: false          // For hiding and displaying add/remove buttons
      };
      this.addA = this.addA.bind(this);
      this.remA = this.remA.bind(this);
      this.setText = this.setText.bind(this);
      this.setRadio = this.setRadio.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
      this.handleAnswerReturn = this.handleAnswerReturn.bind(this);
    }

    componentWillMount(){
        this.addA();
    }

    // Adds an answer
    addA(){
        var newArray = this.state.answers.slice();
        newArray.push(<Answer
            key={this.state.answersCount}
            count={this.state.answersCount + 1}
            handleReturn = {this.handleAnswerReturn}
            updatePrev = {this.props.updatePrev}
        />)
        this.setState({
            answers: newArray,
            answersCount: this.state.answersCount + 1
        });
        this.props.updatePrev();
    }

    // Removes the last answer
    remA(){
        RemoveIndAnswers(this.props.count, this.state.answersCount);
        var newArray = this.state.answers.slice();
        newArray.pop()
        this.setState({
            answers: newArray,
            answersCount: this.state.answersCount - 1
        });
        this.props.updatePrev();
    }

    // Removes all answers, changes answer to a written one
    setText(){
        switchTypeText(this.props.count);   // Modify the sumbission array
        var newArray = [];
        newArray.push(<AnswerWritten
            key={0}
        />)
        this.setState({
            answers: newArray,
            answersCount: 1,
            hide: true  // Disable the add/remove buttons
        });
        this.props.updatePrev();
    }

    // Removes the textArea answer, adds a new answer
    setRadio(){
        switchTypeRadio(this.props.count);   // Modify the sumbission array
        var newArray = [];
        newArray.push(<Answer
            key={0}
            count={1}
            handleReturn = {this.handleAnswerReturn}
        />)
        this.setState({
            answers: newArray,
            answersCount: 1,
            hide: false     // Enable add/remove buttons
        });
        this.props.updatePrev();
    }

    /* Pass back the new question */
    handleChange(event){
        this.setState({question: event.target.value});
        this.props.handleQReturn(event.target.value, this.props.count, this.state.questionType);
    }
    /* Pass back the new answer (from Answer)*/
    handleAnswerReturn(value, AnswerNumber){
        this.props.handleReturn(value,AnswerNumber,this.props.count);
    }

    handleChangeCheckbox(event){
        if(this.state.questionType == 0){
            this.setState({questionType: 1});
            this.setText()
        }
        else{
            this.setState({questionType: 0});
            this.setRadio()
        }
    }

    render(){
    return(
        <div>
            <div>
                <div className="w3-col s3 CreateNoticeDiv surveyAddQuestions"><div><label>Question:</label></div></div>
                <div className="w3-col s7 CreateNoticeDiv surveyAddQuestions"> <div><input type="text" name="SQ" placeholder="Question" value={this.state.question} onChange={this.handleChange}/></div></div>
                <div className="w3-col s2 questionSwitch"><label className="switch"><input type="checkbox" name="questionType" onChange={this.handleChangeCheckbox}/><span className="slider round"></span></label></div>

                {this.state.answers.map((item, i) =>
                 <div key={i}>
                   {item}
                 </div>
                )}

            </div>
            <div className="event-buttons" hidden={this.state.hide}>
                <button type="button" className="btn btn-success" id="btnAddA" onClick={this.addA}>+</button>
                <button type="button" className="btn btn-danger" id="btnRemA" onClick={this.remA}>-</button>
            </div>
        </div>
        );
    }
};

class Answer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          Answer: ""
      };
      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        this.setState({Answer: event.target.value});
        this.props.handleReturn(event.target.value, this.props.count);
    }

    render(){
    return(
        <div>
            <div className="w3-col s3 CreateNoticeDiv"><div><label>Answer:</label></div></div>
            <div className="w3-col s9 CreateNoticeDiv"> <div><input type="text" name="SA" placeholder="Answer" value={this.state.Answer} onChange={this.handleChange} onBlur={this.props.updatePrev}/></div></div>
        </div>
        );
    }
};

class AnswerWritten extends React.Component {
    render(){
    return(
        <div>
            <div className="w3-col s3 CreateNoticeDiv"><div><label>Answer:</label></div></div>
            <div className="w3-col s9 CreateNoticeDiv"><div><textarea rows="5" name="SContent" disabled={true} placeholder="The user will be able to enter their own answer here"></textarea></div></div>
        </div>
        );
    }
};

/****** General Functions ******/
// Called when user changes Survey Answer type to written
function switchTypeText(qNumber){
    RemoveAnswers(qNumber);
    // Sets the questions type to textArea
    for(var i = Questions.length-1; i > -1; i--) {
        if(Questions[i]['answerType'] == 0 & Questions[i]['questionNo'] == qNumber) {
            Questions[i]['answerType'] = 1; // TextArea
        }
    }
}

// Called when user changes Survey Answer type to Radio
function switchTypeRadio(qNumber){
    // Sets the questions type to radio
    for(var i = Questions.length-1; i > -1; i--) {
        if(Questions[i]['answerType'] == 1 & Questions[i]['questionNo'] == qNumber) {
            Questions[i]['answerType'] = 0; // Radio
        }
    }
}

// Removes any answers they had already entered
function RemoveAnswers(qNumber){
    for(var i = Answers.length-1; i > -1; i--) {
        if(Answers[i]['questionNo'] == qNumber) {
            Answers.splice(i,1);
        }
    }
}

// Removes a particular answer
function RemoveIndAnswers(qNumber, aNumber){
    for(var i = 0; i < Answers.length; i++) {
        if((Answers[i]['aNum'] == aNumber) & (Answers[i]['questionNo'] == qNumber)) {
            Answers.splice(i,1);
            return true;
        }
    }
    return false;
}
