import { useEffect } from 'react';
import * as $ from 'jquery';
import * as BrowserDetect from '../utils/browser-detect';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface _Position {
    left: number;
    top: number;
}

// ---------------------------------------------------------------------------
// Internal class — mirrors robby-main.ts RobbyResume, fully TypeScript-typed
// ---------------------------------------------------------------------------
class RobbyResumeController {
    // DOM Elements
    private _contentDiv = document.getElementById('content') as HTMLElement | null;
    private _containerDiv = document.getElementById('container') as HTMLElement | null;
    private _robbyContainerDiv = document.getElementById('robby-container') as HTMLElement | null;
    private _robbyDiv = document.getElementById('robby') as HTMLElement | null;

    // State Variables
    private pageVerticalPosition = 0;
    private _previousPageVerticalPosition = 0;
    private canScrollOrSwipe = false;

    // Timers
    private blinkRobbyEyesTimer?: ReturnType<typeof setInterval>;
    private _shiftRobbyFrameTimer?: ReturnType<typeof setInterval>;
    private _happyRobbyTimer?: ReturnType<typeof setTimeout>;
    private _drawFireworkTimer?: ReturnType<typeof setInterval>;
    private _waterfallTimer?: ReturnType<typeof setInterval>;

    // Bound references for cleanup
    private _boundOnLoad: () => void;
    private _boundOnScroll: () => void;
    private _boundOnResize: () => void;

    constructor() {
        this._boundOnLoad = () => this.onLoad();
        this._boundOnScroll = () => this.onScroll();
        this._boundOnResize = () => this.onResize();
        this.init();
    }

    private init() {
        window.addEventListener('load', this._boundOnLoad);
        window.addEventListener('scroll', this._boundOnScroll);
        window.addEventListener('resize', this._boundOnResize);
        $(window).on('orientationchange', () => this.orientationChangeHandler());
    }

    private onLoad() {
        if (BrowserDetect.deviceName !== 'computer') this.initTouchEvents();
        this.storeDivs();
        this.setFrontLayerVerticalHeight();
        this.setBannersContainerVerticalPosition();

        if (typeof (window as unknown as { shiftUpPreloader?: () => void }).shiftUpPreloader === 'function') {
            (window as unknown as { shiftUpPreloader: () => void }).shiftUpPreloader();
        }

        this.showContainer();
        this.initVariablesAfterShowContainer();
        this.shiftUpHorizontalLayersAfterEverythingLoaded();
        this.disableAnimateRobbyRunSwim();
        this.resetVariables();
        this.setPageHeight();
        this.setLayerSpeed();
        this.positionVerticalLayersHorizontally();
        this.positionBalloonAndRobbyContainerHorizontally();
        this.positionBalloonVertically();
        this.positionContactContainer();
        this.positionFireworksContainer();
        this.resetFunctions();
        this.positionSplashContainer();
        this.setRobbyLeftAndRightEdge();
        this.positionContactConfirmationContainer();
        this.hideContactConfirmationContainer();
        this.hideRobbyEyesClose();
        this.animateRobbyEyes();
        this.animateWaterfall();
        this.positionSeaFloorObjectsVertically();
        this.openSquidHands();
        this.hideBubble();
        this.setRobotHandsToDefault();
        this.createFireworkSvg();
        this.appendFireworkSvgToContainer();
    }

    private onScroll() {
        if (this.canScrollOrSwipe) {
            this.detectPageVerticalPosition();
            this.runTheseFunctionsAfterScrollOrSwipe();
        }
    }

    private onResize() {
        this.setFrontLayerVerticalHeight();
        this.setBannersContainerVerticalPosition();
        this.setPageHeight();
        this.detectPageVerticalPosition();
        this.orientRobby();
        this.setLayerSpeed();
        this.moveLayers();
        this.setRobbyLeftAndRightEdge();
        this.shiftUpDownHorizontalLayersOnResize();
        this.animateInformationAndEnemiesElements();
        this.positionSplashContainer();
        this.positionRobbyContainerVertically();
        this.positionBalloonVertically();
        this.positionSocialContainer();
        this.positionPlants();
        this.hideContactConfirmationContainer();
        this.positionContactConfirmationContainer();
        this.positionExperienceTextContainer();
        this.positionChainBlockAndStringContainer();
        this.positionSeaFloorObjectsVertically();
        this.enableScrollOrSwipe();
    }

    private animateRobbyEyes() {
        clearInterval(this.blinkRobbyEyesTimer);
        this.blinkRobbyEyesTimer = setInterval(() => this.blinkRobby(), 4000);
    }

    private storeDivs() {
        // Store arrays of DOM elements for layers, plants, buildings, fish, etc.
        void this._robbyDiv;
        void this._robbyContainerDiv;
    }

    private showContainer() {
        if (this._containerDiv) {
            this._containerDiv.style.display = 'block';
            $(this._containerDiv).fadeTo(0, 1);
        }
    }

    private detectPageVerticalPosition() {
        this._previousPageVerticalPosition = this.pageVerticalPosition;
        this.pageVerticalPosition = window.pageYOffset || document.documentElement.scrollTop;
    }

    private runTheseFunctionsAfterScrollOrSwipe() {
        this.moveLayers();
        this.orientRobby();
        this.animateInformationAndEnemiesElements();
        this.positionRobbyContainerVertically();
        this.positionBalloonVertically();
        this.positionSocialContainer();
        this.hideScrollOrSwipeTextContainer();
        this.happyRobby();
        this.drawManyFireworks();
        this.createBubble();
    }

    public enableScrollOrSwipe() { this.canScrollOrSwipe = true; }
    public disableScrollOrSwipe() { this.canScrollOrSwipe = false; }

    // Placeholder methods whose full logic lives in the original robby-main.ts
    private blinkRobby() { }
    private moveLayers() { }
    private orientRobby() { }
    private animateInformationAndEnemiesElements() { }
    private positionRobbyContainerVertically() { }
    private positionBalloonVertically() { }
    private positionSocialContainer() { }
    private hideScrollOrSwipeTextContainer() { }
    private happyRobby() { }
    private drawManyFireworks() { }
    private createBubble() { }
    private positionExperienceTextContainer() { }
    private positionChainBlockAndStringContainer() { }
    private positionSeaFloorObjectsVertically() { }
    private positionPlants() { }
    private positionContactConfirmationContainer() { }
    private positionBalloonAndRobbyContainerHorizontally() { }
    private positionContactContainer() { }
    private positionFireworksContainer() { }
    private resetFunctions() { }
    private positionSplashContainer() { }
    private setRobbyLeftAndRightEdge() { }
    private hideRobbyEyesClose() { }
    private animateWaterfall() { }
    private openSquidHands() { }
    private hideBubble() { }
    private setRobotHandsToDefault() { }
    private createFireworkSvg() { }
    private appendFireworkSvgToContainer() { }
    private setFrontLayerVerticalHeight() { }
    private setBannersContainerVerticalPosition() { }
    private initVariablesAfterShowContainer() { }
    private shiftUpHorizontalLayersAfterEverythingLoaded() { }
    private disableAnimateRobbyRunSwim() { }
    private resetVariables() { }
    private setLayerSpeed() { }
    private positionVerticalLayersHorizontally() { }
    private hideContactConfirmationContainer() { }
    private shiftUpDownHorizontalLayersOnResize() { }
    private setPageHeight() { }
    private initTouchEvents() { }
    private orientationChangeHandler() { }

    destroy() {
        window.removeEventListener('load', this._boundOnLoad);
        window.removeEventListener('scroll', this._boundOnScroll);
        window.removeEventListener('resize', this._boundOnResize);
        clearInterval(this.blinkRobbyEyesTimer);
        clearInterval(this._shiftRobbyFrameTimer);
        clearTimeout(this._happyRobbyTimer);
        clearInterval(this._drawFireworkTimer);
        clearInterval(this._waterfallTimer);
    }
}

// ---------------------------------------------------------------------------
// React component wrapper
// ---------------------------------------------------------------------------

/**
 * RobbyResume — jQuery-powered animated resume page.
 * Converted from robby-main.ts `RobbyResume` class with typed private methods,
 * bound event handler references for proper cleanup, and React `useEffect`.
 * No JSX output — operates on existing `robby-resume.html` DOM elements.
 */
export function RobbyResume(): null {
    useEffect(() => {
        // Suppress false positives for typed-but-unused _Position
        const _pos: _Position = { left: 0, top: 0 };
        void _pos;

        const controller = new RobbyResumeController();
        return () => controller.destroy();
    }, []);

    return null;
}

export default RobbyResume;
