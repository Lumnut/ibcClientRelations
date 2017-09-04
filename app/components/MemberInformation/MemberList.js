import React from 'react';
import MemberListItem from './MemberListItem.js'

class MemberList extends React.Component {

  constructor(props) {
    super(props);
    this.generateMemberList = this.generateMemberList.bind(this);
  }

  // Maps all retrieved members to a row in the table
  generateMemberList() {
    const memberList = this.props.member_list;
    var list = null;
    if (memberList) {
      list = memberList.map((x) => {
        return(
          <MemberListItem
            key={x['email']}
            first_name={x['firstname']}
            last_name={x['lastname']}
            email={x['email']}
            business={x['businessname']}
            expiry={x['expiry']}
          />
        );
      })
    }
    return list;
  }

  render() {
    return (
      <div id='member-list'>
        {/* Headings for the Member List Table*/}
        <div id='member-list-headers'>
          <div className='table-header'>First Name</div>
          <div className='table-header'>Last Name</div>
          <div className='table-header'>Email</div>
          <div className='table-header'>Business</div>
          <div className='table-header'>Membership Expiry</div>
        </div>
        {this.generateMemberList()}
      </div>
    );
  }
};

export default MemberList;
