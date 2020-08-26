import React, { Component } from "react";
import { Link } from "react-router-dom";
import Parser from "html-react-parser";
import { connect } from 'react-redux'
import { jumpToComment } from '../../store/actions/notificationAction'

const mapStateToProps = (state) => {
  return {
    isOpen: state.popup.isOpen,
    isLoggedIn: state.currentUser.isLoggedIn,
    currentUser: state.currentUser.userData,
    socket: state.socket.socket,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    jumpToComment: (commentId, isReply, date) => dispatch(jumpToComment(commentId, isReply, date))
  }
}

export default connect (mapStateToProps, mapDispatchToProps)
(class Notifications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: [],
      unReadNotis: 0,
      pageSize: 0,
      hasChange: false,
      notisTotal: 0
    }


    this.setInfo = this.setInfo.bind(this);
    this.readNoti = this.readNoti.bind(this);
    this.handleScroll = this.handleScroll.bind(this)
    this.mustGetNotifications = this.mustGetNotifications.bind(this)
    this.loadNotifications = this.loadNotifications.bind(this)
  }

  readNoti(notiId, commentId, jumpToComment, isReply, date) {
    this.props.socket.emit("readNoti", {
      notiId: notiId,
    });
    if(jumpToComment) {
      this.props.jumpToComment(commentId, isReply, date)
    }
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if(nextState.hasChange && nextState.hasChange != this.state.hasChange) {
      this.mustGetNotifications(nextState)
    }
  }

  componentDidMount() {
    this.mustGetNotifications(this.state)
    this.loadNotifications()
  }


  mustGetNotifications(state) {
    this.props.socket.emit('getNotifications', {
      userId: this.props.currentUser.id,
      pageSize: state.pageSize,
      hasChange: state.hasChange
    })
  }

  loadNotifications() {
    this.props.socket.on(`returnNotificationsOf${this.props.currentUser.id}`, data => {
      if (data.error) {
        this.setState({ errorMessage: data.error });
      } else {
        let loadedNotis = this.state.notifications
        if(!loadedNotis.length || (loadedNotis && this.state.hasChange)) {
          this.setState({
            notifications: data.listNotis,
            notisTotal: data.notisTotal,
            pageSize:  data.listNotis.length,
            hasChange: false,
            unReadNotis: data.unReadNotis
          });
        } else {
          this.setState({
            notifications: [...loadedNotis, ...data.listNotis],
            notisTotal: data.notisTotal,
            pageSize: loadedNotis.length + data.listNotis.length,
            unReadNotis: data.unReadNotis
          });
        }
      }
    })
  }

  UNSAFE_componentWillMount() {
    this.props.socket.on(`hasChange${this.props.currentUser.id}`, () => {
      this.setState({hasChange: true})
    })
  }

  handleScroll(e) {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    let { notisTotal, pageSize } = this.state
    if (bottom && notisTotal > pageSize) { 
      this.mustGetNotifications(this.state)
    }
  }

  componentWillUnmount() {
    this.props.socket.off(`returnNotificationsOf${this.props.currentUser.id}`)
    this.props.socket.off(`hasChange${this.props.currentUser.id}`)
  }

  setInfo(notification) {
    let postName = notification.post.name;
    let postId = notification.post._id;
    let date = notification.date
    let isRead = notification.status == "unread" ? false : true;
    let message;

    if (notification.rocks) {
      message = `<b>${notification.rocks.name}</b> threw a rock at your <b>${postName}</b> post`;
      return { date, message, avatar: notification.rocks.avatar, postId, isRead, jumpToComment: false, isReply: false };
    } else if (notification.flowers) {
      message = `<b>${notification.flowers.name}</b> gave a flower for your <b>${postName}</b> post`;
      return { date, message, avatar: notification.flowers.avatar, postId, isRead, jumpToComment: false, isReply: false };
    } else if (notification.replier) {
      message = `<b>${notification.replier.name}</b> replied to your comment on <b>${postName}</b> post`;
      return { date, message, avatar: notification.replier.avatar, postId, isRead, jumpToComment: true, isReply: true };
    } else {
      message = `<b>${notification.commenter.name}</b> commented on your <b>${postName}</b> post`;
      return { date, message, avatar: notification.commenter.avatar, postId, isRead, jumpToComment: true, isReply: false };
    }
  }

  render() {
    let { notifications, unReadNotis } = this.state 

    if (notifications && !notifications.length ) {
      return (
        <div className="notifications">
          <h4 className="u-center-text u-text-bold u-center-el u-color-light">
            No notification found
          </h4>
        </div>
      );
    } else {
      return (
        <div className="notifications"
        onScroll={this.handleScroll}>
            <div className="notifications__unreads">
              {`Unread (${unReadNotis})`}
            </div>
          {notifications.map((notification) => {
            let { avatar, message, postId, isRead, jumpToComment, isReply, date } = this.setInfo(
              notification
            );
            let notificationStyle = isRead
              ? "notification"
              : "notification--unread";

            return (
              <Link
                onClick={() => {this.readNoti(notification._id, notification.comment, jumpToComment, isReply, date)}}
                to={`/destinations/${postId}`}
                className={notificationStyle}
                key={notification._id}
              >
                <img src={avatar} className="notification__avatar"></img>
                <div className="notification__content">{Parser(message)}</div>
              </Link>
            );
          })}
        </div>
      );
    }
  }
})
