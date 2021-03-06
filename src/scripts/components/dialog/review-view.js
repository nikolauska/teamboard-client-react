import React    from 'react/addons';
import Carousel from 'nuka-carousel';
import markdown from 'markdown';

import Dialog from '../../components/dialog';
import Avatar from '../../components/avatar';

import listener from '../../mixins/listener';
import CommentStore from '../../stores/comment';

function getCommentMap(tickets) {
	return tickets.reduce((map, ticket) => {
		map[ticket.id] = CommentStore.getComments(ticket.id);
		return map;
	}, { });
}

/**
 *
 */
export default React.createClass({
	mixins: [ Carousel.ControllerMixin, listener(CommentStore) ],

	propTypes: {
		tickets: React.PropTypes.object
	},

	getInitialState() {
		return { comments: getCommentMap(this.props.tickets) }
	},

	onChange() {
		return this.setState({ comments: getCommentMap(this.props.tickets) });
	},

	componentWillUpdate() {
		this.currentSlide = this.state.carousels.carousel.state.currentSlide;
		this.ticketArrayLength = this.props.tickets.toJS().length;
	},

	componentWillMount() {
		this.ticketArrayLength = this.props.tickets.toJS().length;
	},

	onKeyDown(e) {
		let key = e.keyCode ? e.keyCode : e.which;
		if (key === 27) {
			this.props.onDismiss();
		}
	},

	componentDidMount() {
		document.addEventListener('keydown', this.onKeyDown);
	},

	componentWillUnmount() {
		document.removeEventListener('keydown', this.onKeyDown);
	},

	getDecorations() {
		return [
			{
				component: React.createClass({
					onKeyDown(e) {
						let key = e.keyCode ? e.keyCode : e.which;
						if (key === 39) {
							this.props.nextSlide();
						}else if (key === 37) {
							this.props.previousSlide();
						}
					},

					componentDidMount() {
						document.addEventListener('keydown', this.onKeyDown);
					},

					componentWillUnmount() {
						document.removeEventListener('keydown', this.onKeyDown);
					},

					render() {
						let style = { opacity: 0 };

						if(this.props.currentSlide !== 0 && this.props.slideCount > 0) {
							style = { opacity: 1, cursor: 'pointer' }
						}
						return (
							<span style={ style }
							onClick={this.props.previousSlide}
							className="fa fa-chevron-left" />
						);
					}
				}),

				position: 'CenterLeft',

				style: { padding: 10 }
			},
			{
				component: React.createClass({
					render() {
						let style = { opacity: 0 };
						if(this.props.currentSlide !== --this.props.slideCount) {
							style = { opacity: 1, cursor: 'pointer' }
						}
						return (
							<span style={style}
							onClick={this.props.nextSlide}
							className="fa fa-chevron-right" />
						);
					}
				}),

				position: 'CenterRight',

				style: { padding: 10 }
			}
		];
	},

	renderComments(ticket) {
		if(!this.state.comments[ticket.id]) return null;

		return this.state.comments[ticket.id].map((comment) => {
			let user     = comment.createdBy;
			let content  = comment.message;
			let username = user.username || user.name;
			let avatar   = user.avatar;
			let usertype = user.account_type || user.type;

			return (
				<div className="review-comment" key={comment.id}>
					<Avatar size={32} name={username}
						imageurl={avatar}
						usertype={usertype}
						isOnline={true}>
					</Avatar>
					<p className="review-comment-username">{username}</p>
					<p className="review-comment-message">{content}</p>
				</div>
			);
		})
	},

	renderTickets() {
		return this.props.tickets.toJS().map((ticket, index) => {
			let markupContent = markdown.markdown.toHTML(ticket.content).replace(/<a href="/g, '<a target="_blank" href="');
			let dialogClasses = index !== this.currentSlide ? 'review-dialog' : 'review-dialog active';
			let ticketColor = { backgroundColor: ticket.color };
			let ticketNumber = <span className="ticket-number">
					{ `${index+1} / ${this.ticketArrayLength}` }
				</span>;

			return (
				<div className="review-dialog-container">
					<div className={dialogClasses}>
						<section style={ticketColor}
							className="review-dialog-header"/>
						<div className="content-wrapper">
							{ticketNumber}
							<p className="ticket-header-text"
									title={ticket.heading}>
								{ticket.heading}
							</p>
							<span className="review-dialog-content"
								dangerouslySetInnerHTML={{ __html: markupContent }}>
							</span>
							<section className="review-dialog-comments">
								<section className="review-comment-wrapper">
									{this.renderComments(ticket)}
								</section>
							</section>
						</div>
					</div>
				</div>
			);
		})
	},

	render() {
		let currentTicket =
			`${this.currentSlide + 1} / ${this.ticketArrayLength}`;

		return (
			<Dialog className="review" viewProfile="review"
					onDismiss={this.props.onDismiss}>
				<Carousel ref="carousel" className="infocarousel"
						data={this.setCarouselData.bind(this, 'carousel')}
						decorators={this.getDecorations()}
						slideWidth={0.70}
						cellAlign="center"
						dragging={true}>
					{this.renderTickets()}
				</Carousel>
				<span className="ticket-number">{currentTicket}</span>
			</Dialog>
		);
	}
});
