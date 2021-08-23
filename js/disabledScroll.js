'use strict';
window.disableScroll = () => {
  const widthScroll = window.innerWidth - document.body.offsetWidth;
  document.body.dbScrollY = window.scrollY;
  document.body.style.cssText = `
		position: fixed;
		top: ${-window.scrollY}px;
		left: 0;
		width: 100%;
		overflow: hidden;
		height: 100vh;
		padding-right: ${widthScroll}px;
	`;
};

window.enableScroll = () => {
  document.body.style.cssText = 'position: relative;';
  window.scroll({
    top: document.body.dbScrollY
  });
};
