import React from 'react';
import $ from 'jquery';
import FieldTable from './EditSignupTable.js';
import EditPayment from './EditPayment.js';

class EditSignup extends React.Component{

    constructor(){
        super()

        this.state = {
            data1loaded: false,
            data2loaded: false,
            signupFields: [{
                 displayname: [],
                 columnname: [],
                 inputtype: [],
                 tablename: [],
                 minimum: [],
                 maximum: [],
                 mandatory: [],
                 disabled: [],
                 DataID: []
             }],
             paymentFields: [{
                 name: [],
                 info: [],
                 amount: [],
                 expirytype: [],
                 expirydate: []
             }],
             edit: false,
             currentIndex: ""
        }
        this.renderPage = this.renderPage.bind(this);
        this.sendData = this.sendData.bind(this);
        this.sendFieldtoDisable = this.sendFieldtoDisable.bind(this);
        this.sendFieldtoEnable = this.sendFieldtoEnable.bind(this);
        this.updateEdit = this.updateEdit.bind(this);
        this.sendUpdatedField = this.sendUpdatedField.bind(this);
    }

    componentWillMount(){
        this.getFields();
        this.getPaymentDetails();

    }
    //Retrieve all of the fields that are on the sign up form corresponding to the chamber who is logged in
    getFields(){

      $.ajax({url: '/php/chamber_form.php', type: 'POST',
          dataType: 'json',

      success: response => {
         this.setState({
             data1loaded: true,
             signupFields: response
         });
    }});
    }

    getPaymentDetails(){
        $.ajax({url: '/php/get_membership_payments.php', type: 'POST',
            dataType: 'json',

        success: response => {

           this.setState({
               data2loaded: true,
               paymentFields: response,
           });
      }});
    }


    sendData(newDisplayname, newOptional, newType, newMin, newMax){
        console.log("sending data")
        $.ajax({url: '/php/insert_newsignup_field.php', type: 'POST',
            dataType: 'json',
            data: {
                'name': newDisplayname,
                'optional': newOptional,
                'type': newType,
                'minimum': newMin,
                'maximum': newMax
            },
            success: response => {
                console.log("working",response)
                this.getFields();
            },
            error: response => {
                console.log("not working",response)
            }
        });
    }

    sendUpdatedField(newDisplayname, newOptional, newType, newMin, newMax){
        var optional=null;
        newOptional === true ? optional = '1' : optional = '0'
        console.log("sending data", newDisplayname, optional, newType, newMin, newMax, this.state.signupFields[this.state.currentIndex].DataID)
        this.setState({
            edit: false
        })
        $.ajax({url: '/php/update_signup_field.php', type: 'POST',
            dataType: 'json',
            data: {
                'name': newDisplayname,
                'optional': optional,
                'type': newType,
                'minimum': newMin,
                'maximum': newMax,
                'DataID': this.state.signupFields[this.state.currentIndex].DataID
            },
            success: response => {
                console.log("is this actually updating", response)
                this.getFields();
            },
            error: response => {
                console.log("no its not working",response)
            }
        });
    }

    sendFieldtoDisable(name){
        console.log("sending data")
        $.ajax({url: '/php/delete_signup_field.php', type: 'POST',
            dataType: 'json',
            data: {
                'name': name
            },
            success: response => {
                console.log(response)
                this.getFields();
            },
            error: response => {
                console.log(response)
            }
        });
    }

    sendFieldtoEnable(name){
        console.log("sending data")
        $.ajax({url: '/php/enable_signup_field.php', type: 'POST',
            dataType: 'json',
            data: {
                'name': name
            },
            success: response => {
                console.log(response)
                this.getFields();
            },
            error: response => {
                console.log(response)
            }
        });
    }

    updateEdit(index){
        this.setState({
            edit: true,
            currentIndex: index
        })
    }

    renderPage(){
        return(
            <div className='w3-row' id="edit-signup">
                <div className="w3-container w3-card-4 w3-light-grey">
                    <h2 id="h2-editsignup">Edit Sign up Form</h2>
                    <hr className = "signup-divider" />
                    <h3 id="h3-editsignup">Fields currently on Sign up Form</h3>
                    <FieldTable
                        sendNewFields = {this.sendData}
                        disableField={this.sendFieldtoDisable}
                        enableField={this.sendFieldtoEnable}
                        signupFields = {this.state.signupFields}
                        edit = {this.state.edit}
                        currentIndex = {this.state.currentIndex}
                        updateEdit = {this.updateEdit}
                        sendUpdatedField ={this.sendUpdatedField}   />
                    <h3 id="h3-editsignup">Edit Membership Payments</h3>
                    <hr className = "signup-divider" />
                    <EditPayment paymentFields = {this.state.paymentFields}/>
                    <h3 id="h3-editsignup">Upload Logo</h3>
                    <hr className = "signup-divider" />
                </div>
            </div>
        )
    }

    render(){

        return(
            <div>
                {(this.state.data1loaded && this.state.data2loaded) ? this.renderPage() : null}
            </div>
        );
    }
}

export default EditSignup;
