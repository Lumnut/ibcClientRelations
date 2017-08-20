import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Fields from './inputfields.js'

var fieldsArray = {}

class Page extends React.Component {

  constructor(props) {
      super(props);

      //get the chamberID of the selected chamber from parent
      this.state = {
          chamber: props.listNameFromParent,
          displayname: [],
          columnname: [],
          inputtype: []
        };

    }

    //ajax request to retrieve the fields on the sign up form that correspond to the chamber selected
    componentWillMount() {
        var test = this.state.chamber;

      $.ajax({url: '/php/chamber_form.php', type: 'POST',
          dataType: 'json', async: false,
          data: {
              'test': this.state.chamber
          },
      success: response => {

        var temp1=[];
        var temp2=[];
        var temp3=[];

        for(var i=0; i<response.length; i++){
            temp1[i] = response[i].displayname;
            temp2[i] = response[i].columnname;
            temp3[i] = response[i].inputtype;
        }
        this.setState({
            displayname: temp1,
            columnname: temp2,
            inputtype: temp3
        })
      }});
    }

    handleChange(event) {
        console.log(event.target.value)
    }

  render() {
    return (
        <div>
        <Fields displayname={this.state.displayname} columnname={this.state.columnname} inputtype={this.state.inputtype}  />
        </div>

    );
  }
}
export default Page;
