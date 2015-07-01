var React = require('react'),
    ReactIScroll = require('react-iscroll'),
    iScroll = require('iscroll');

export default React.createClass({
    getDefaultProps() {
        return {
            options: {
                mouseWheel: true,
                scrollbars: true,
                preventDefault: false,
                bounce: false
            }
        }
    },

    render: function() {
        return (
            <ReactIScroll iscroll={iScroll}
                          options={this.props.options}>
                {this.renderChildrens()}
            </ReactIScroll>
        )
    },

    renderChildrens() {
        return React.Children.map(this.props.children, (child) => {
            return React.addons.cloneWithProps(child, {});
        })
    }
});