import React, { Component } from 'react';
import { hashHistory, Link } from 'react-router'
import Slider from './slider.jsx';
import HomeNav from './nav.jsx';
import VideoList from './video-list.jsx';
import VideoPlay from './video-play.jsx';
import Hot from './hot.jsx'
import { connect } from 'react-redux'
import api from './../../api'
import { fetchPostsIfNeeded } from '../../actions/user'
import { getVideoList, play } from './../../actions/user.js'
import { formatTime } from '../../utils/index.js'

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			videoList: [],
			videoClass: 0,
			navs: ['首页', '电视剧', '电影', '综艺', '纪录片', 'MV', '动画'],
			playStatus: false //list
		}

		this.changeNav = this.changeNav.bind(this)
	}

	componentDidMount() {
		window.scrollTo(0, 0);
		this.getIndexData();
	}

	getIndexData() {
		const { fetchPostsIfNeeded } = this.props

		console.log(this.props)
		const { videoClass } = this.state

		fetchPostsIfNeeded(api.getIndexData, getVideoList, `videoClass=${videoClass}`)
	}

	changeNav(index) {
		this.setState({
			videoClass: index,
			playStatus: false
		}, () => {
			this.getIndexData()
		})
	}

	linkTo(id, e) {
		e.preventDefault()
		this.props.setVideoId(id)
		hashHistory.push(`/home/${id}`)
	}

	render() {
		const { navs, videoClass } = this.state;
		const { videoList = [] } = this.props
		const { newVideos = [], hotVideos = [] } = videoList
		const showType = this.props.params.type
		const recommendVideo = [...hotVideos]

		recommendVideo.length = 4

		return (
			<div>
				<Slider />
				<HomeNav navs={navs} changeNav={this.changeNav} toRouter="/home/list" />
				{
					showType == 'list' || !showType ? (
						<div>
							{
								videoClass ? (
									<div>
										<VideoList videoList={newVideos} title="最新视频" />
										<VideoList videoList={hotVideos} title="最热视频" />
									</div>
								) : <VideoList videoList={hotVideos} title="最热视频" />
							}
						</div>
					) : (
							<div className="video-play-container">
								<VideoPlay key={new Date()} />
								<div className="video-play-list">
									<h3>视频列表</h3>
									{
										recommendVideo && recommendVideo.map((video, index) => (
											<div className="recommend-item" key={index} onClick={this.linkTo.bind(this, video.id)}>
												<a href="#">
													<div className="recommend-img">
														<img src={require("./../../assets/" + video.imgSrc)} className="response-img" />
													</div>
													<div className="recommend-info">
														<p>{video.title} - {formatTime(video.aTime).split(' ')[0]}</p>
														<p className="video-intro">{video.content}</p>
													</div>
												</a>
											</div>
										))
									}
								</div>
							</div>
						)
				}
				<Hot />
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		videoList: state.user.videoList
	}
}

function setVideoId(id) {
  return (dispatch, getState) => dispatch(play({videoId: id}))
}

export default connect(
	mapStateToProps, { setVideoId, fetchPostsIfNeeded }
)(Home)