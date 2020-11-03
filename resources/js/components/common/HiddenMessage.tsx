import React from "react";
import { Transition } from "react-transition-group";

const HiddenMessage = ({ show, children, duration = 400, ...props }) => {
    const defaultStyle = {
        transition: `opacity ${duration}ms ease-in-out`,
        opacity: 0,
        visibility: `hidden`
    };

    const setEnteringStyles = node => {
        node.style.visibility = "visible";
    };

    const setEnteredStyles = node => {
        node.style.opacity = 1;
    };

    const setExitingStyle = node => {
        node.style.opacity = 0;
    };

    const setExitedStyle = node => {
        node.style.visibility = "hidden";
    };

    return (
        <Transition
            onEntering={e => setEnteringStyles(e)}
            onEntered={e => setEnteredStyles(e)}
            onExiting={e => setExitingStyle(e)}
            onExited={e => setExitedStyle(e)}
            in={Boolean(show)}
            timeout={duration}
        >
            <div style={{ ...defaultStyle }}>{children}</div>
        </Transition>
    );
};

export default HiddenMessage;
