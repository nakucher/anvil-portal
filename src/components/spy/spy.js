/*
 * The AnVIL
 * https://www.anvilproject.org
 *
 * Anvil outline spy component.
 * Provides event listener for scroll and hashchange events.
 */

// Core dependencies
import React from "react";

class Spy extends React.Component {

    elementIdsByAnchorFromTop = new Map();

    constructor(props) {
        super(props);

        this.state = ({activeOutline: ""});
        this.handleScroll = this.handleScroll.bind(this);
        this.handleHashChange = this.handleHashChange.bind(this);
    }

    componentDidMount() {
        this.getPageAnchors();
        window.addEventListener("scroll", this.handleScroll);
        window.addEventListener("hashchange", this.handleHashChange, false);
    };

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
        window.removeEventListener("hashchange", this.handleHashChange, false);
    };

    getPageAnchors = () => {

        let anchorables = Array.from(document.getElementById("content").querySelectorAll("[id]"));

        let currentScrollPos = window.scrollY;

        anchorables.forEach(pageAnchor => {

            if ( Number(pageAnchor.tagName.charAt(1)) <= 3 ) {

                this.elementIdsByAnchorFromTop.set((pageAnchor.getBoundingClientRect().top + currentScrollPos), pageAnchor.id);
            }
        });
    };

    handleHashChange = () => {

        this.setState({activeOutline: window.location.hash});
        this.props.onOutlineChange(this.state.activeOutline);
    };

    handleScroll = () => {

        let currentScrollPos = window.scrollY + 100;
        let endScrollPos = document.body.clientHeight - window.innerHeight + 100;

        // Check not at the bottom of the page
        if ( currentScrollPos !== endScrollPos ) {

            let currentAnchorPos;

            for ( let anchorPos of this.elementIdsByAnchorFromTop.keys() ) {

                if ( currentScrollPos >= anchorPos ) {

                    currentAnchorPos = anchorPos;
                }
                else {

                    break; // exit iterator
                }
            }

            let currentElementId = `#${this.elementIdsByAnchorFromTop.get(currentAnchorPos)}`;

            if ( currentElementId !== this.state.activeOutline ) {

                if ( currentAnchorPos !== undefined ) {

                    window.history.pushState(null, "", `#${this.elementIdsByAnchorFromTop.get(currentAnchorPos)}`);
                    this.setState({activeOutline: currentElementId});
                    this.props.onOutlineChange(this.state.activeOutline);
                }
                else {

                    window.history.pushState(null, "", window.location.pathname);
                    this.setState({activeOutline: ""});
                    this.props.onOutlineChange(this.state.activeOutline);
                }
            }
        }
    };

    render() {
        return this.props.children
    }
}

export default Spy;
