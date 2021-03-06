/*
Page Gets:
    key={survey[i].SurveyID}
    SurveyID={survey[i].SurveyID}
    title={survey[i].SurveyTitle + survey[i].SurveyID}
    DatePosted={survey[i].DatePosted}
    noQuestions={survey[i].noQuestions}
*/

import React from 'react';
import $ from 'jquery';                                         /* For ajax query */
import Slider from 'react-slick';                               /* https://github.com/akiran/react-slick */
import { RadioGroup, RadioButton } from 'react-radio-buttons';  /* https://www.npmjs.com/package/react-radio-buttons */
import {TextArea} from 'react-text-input';                      /* https://github.com/smikhalevski/react-text-input */
import moment from "moment";                                    /* https://momentjs.com/ */
import {Collapse} from 'react-collapse';                        /* https://www.npmjs.com/package/react-collapse */

var questions = [];
var answers = [];
var userAnswers = [];

const Loader = () =>
  <div className="loader">
    <div />
    <div />
    <div />
  </div>

class NoticeSurvey extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          items: [],
          hidden: true
      };
      this.collapse = this.collapse.bind(this);
      this.deleteNotice = this.deleteNotice.bind(this);
      questions = [];
      answers = [];
    }

    componentWillMount(){
        /* get all Questions and Answers */
        if (this.props.Disabled == true){
            // For use in Create Survey Page, provides a disabled preview version of component
            questions = this.props.Questions;
            answers = this.props.Answers;
        }
        else{
            this.get_SurveyQuestions();
            this.get_SurveyAnswers();
        }
        this.setData();
    }

    componentWillReceiveProps(nextProps){
        if (this.props.Disabled == true){
            // For use in Create Survey Page, provides a disabled preview version of component
            questions = this.props.Questions;
            answers = this.props.Answers;
        }
        else{
            this.get_SurveyQuestions();
            this.get_SurveyAnswers();
        }
        this.setData();
    }

    /* Format the Questions and Answers properly, push into list that will be used by the slider */
    setData(){
        var FormattedOutput = [];
        // Cycle through questions and each set of answers
        for(var i = 0; i < questions.length; i++){

            var tmpA = [];
            if (questions[i].answerType == 0 && answers.length > 0){ // Type is RadioButton

                //Add all potential answers for this question
                var firstAnswer;
                var firstAnswerID;
                var found = false;
                for(var b = 0; b < answers.length; b++){
                    if (answers[b].questionNo == questions[i].questionNo){
                        if(found == false){
                            firstAnswer = answers[b].answer;
                            firstAnswerID = answers[b].AnswerID;
                            found = true;
                        }
                        tmpA.push(
                            <RadioButton key={answers[b].AnswerID + answers[b].answer}
                                rootColor="#4d4c4c"
                                value={questions[i].questionNo + ";" + answers[b].AnswerID + ";" + answers[b].answer}>
                                {answers[b].answer}
                            </RadioButton>);
                    }
                }

                //Prepare results array with the first answer
                userAnswers.push({surveyID: this.props.SurveyID, questionNo: questions[i].questionNo, question: questions[i].question, AnswerID: firstAnswerID, Answer: firstAnswer});

                // Add final question / answer pairs
                FormattedOutput.push(<SurveyRadio
                        key={questions[i].questionNo}
                        question={questions[i].question}
                        answers={tmpA}
                        ID = {this.props.SurveyID}
                />)
            }
            else if (questions[i].answerType == 1){ // Type is TextBox
                //Prepare results array
                userAnswers.push({surveyID: this.props.SurveyID, questionNo: questions[i].questionNo, question: questions[i].question, AnswerID: -1, Answer: ""});
                // Add final question / answer pairs
                FormattedOutput.push(<SurveyText
                        key={questions[i].questionNo}
                        qID={questions[i].questionNo}
                        question={questions[i].question}
                        answers={tmpA}
                        ID={this.props.SurveyID}
                />)
            }
        }

        var disableMe = false;
        if (this.props.Disabled == true || this.props.statPage == true){
            disableMe = true;
        }
        // Add the submit page
        FormattedOutput.push(<SubmitPage
                key="Submit"
                collapseSurvey={this.collapse}
                disabled={disableMe}
                ID={this.props.SurveyID}
        />)

        // Set the state to completed question/answer pairs + submit page
        this.setState({
            items: FormattedOutput
        });

    }

    collapse(){
        this.setState({
            hidden: false
        });
    }


    render(){
        var settings = {
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1
        };

        let deleteBtn = null;
        if (this.props.user_type == 1){
            deleteBtn = <div className="w3-col s1">{<button type="button" onClick={this.deleteNotice} className="notificationDeleteBtn" id="btnDelete"><span className="glyphicon glyphicon-trash" style={{color: 'white'}}></span></button>}</div>;
        }

        return(
            <Collapse isOpened={this.state.hidden}>
                <div className="notice">
                    <div className="notice-title">
                        <div className="w3-col s11">
                            <h2>{"New Survey: " + this.props.title}</h2>
                            <h2>{"Posted " + moment(this.props.DatePosted).format("Do MMM YYYY")}</h2>
                        </div>
                        {deleteBtn}
                    </div>
                    <div className="survey-content">
                        <Slider {...settings}>
                            {this.state.items.map((item, i) =>
                             <div key={i}>
                               {item}
                            </div>
                           )}
                        </Slider>
                    </div>
                </div>
            </Collapse>
        );
    }

  deleteNotice(){
        if (confirm("Warning: This will permenantly remove this Survey from your chamber members and can not be undone! Are you sure?") == true){
            $.ajax({
                url: '/php/delete_Survey.php',
                type:'POST',
                dataType: "json",
                data:{
                    'SurveyID': this.props.SurveyID
                }
            });

            this.setState({
                hidden: false
            });
        }
    }

  get_SurveyQuestions(){
      $.ajax({
          url: '/php/get_SurveyQuestions.php',
          type:'POST',
          async: false,
          dataType: "json",
          data: {
              'surveyID': this.props.SurveyID
          },
          success : function(response){
              questions = response;
          }.bind(this)
      });
  }

  get_SurveyAnswers(){
        $.ajax({
            url: '/php/get_SurveyAnswers.php',
            type:'POST',
            async: false,
            dataType: "json",
            data: {
                'surveyID': this.props.SurveyID
            },
            success : function(response){
                answers = response;
            }.bind(this)
        });
    }

};

export default NoticeSurvey;

class SurveyRadio extends React.Component {
    constructor(props) {
      super(props);
      this.getIndex = this.getIndex.bind(this);
      this.onChange = this.onChange.bind(this);
  }
    getIndex(id) {
        for(var i = 0; i < userAnswers.length; i++) {
            if(userAnswers[i].questionNo == id && userAnswers[i].surveyID == this.props.ID) {
                return i;
            }
        }
    }
    onChange(value) {
        // Extract data
        var QuestionNo = value.split(";")[0];
        var AnswerID = value.split(";")[1];
        var answer = value.split(";")[2];

        // Set result
        var index = this.getIndex(QuestionNo);
        userAnswers[index].AnswerID = AnswerID;
        userAnswers[index].Answer = answer;
    }
    render(){
        return(
            <div>
                <h3>{this.props.question}</h3>
                <div id="SurveyAnswers">
                    <RadioGroup onChange={ this.onChange }>
                        {this.props.answers}
                    </RadioGroup>
                </div>
            </div>
        );
    }
};

class SurveyText extends React.Component {
    constructor(props) {
      super(props);
      this.getIndex = this.getIndex.bind(this);
      this.onChange = this.onChange.bind(this);
  }
    getIndex(id) {
        for(var i = 0; i < userAnswers.length; i++) {
            if(userAnswers[i].questionNo == id && userAnswers[i].surveyID == this.props.ID) {
                return i;
            }
        }
    }
    onChange(value) {
        // Set result
        var index = this.getIndex(this.props.qID);
        userAnswers[index].Answer = value;
    }
    render(){
        return(
            <div>
                <h3>{this.props.question}</h3>
                <div>
                    <TextArea fitLineLength={true}
                        onChange={e => this.onChange(e.target.value)}
                    />
                </div>
            </div>
        );
    }
};

class SubmitPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          btnDisabled: false,
          label: "Would you like to submit?"
      };
      this.insert_SurveyAnswers = this.insert_SurveyAnswers.bind(this);
    }

    componentWillMount(){
        if(this.props.disabled == true){
            this.setState({
                btnDisabled: true
            });
        }
    }

    insert_SurveyAnswers(){
        this.setState({
            btnDisabled: true,
            label: "Thank you for taking the time to complete this survey"
        });

      $.ajax({
          url: '/php/insert_SurveyAnswers.php',
          type:'POST',
          dataType: "json",
          data: {
              'data': userAnswers,
              'surveyID' : this.props.ID
          }
      });

        this.timeoutHandle = setTimeout(()=>{
              this.props.collapseSurvey();  // Add your logic for the transition
          }, 3000);

    }

    render(){
    return(
        <div>
            <h3><label htmlFor="title">{this.state.label}</label></h3>
            <div>
                {<button type="button" className="btn btn-primary" id="btnSubmitSurvey" disabled={this.state.btnDisabled} onClick={this.insert_SurveyAnswers}>Submit</button>}
            </div>
        </div>
        );
    }

};
