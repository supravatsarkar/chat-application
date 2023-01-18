function decorateHtmlResponse(page_title) {
  return function (req, res, next) {
    console.log('page_title:-', page_title);
    res.locals.html = true;
    res.locals.title = `${page_title} - ${process.env.APP_NAME}`;
    // set local blank obj for frontend error protect
    res.locals.data = {};
    res.locals.error = {};
    res.locals.loggedInUser = {};
    next();
  };
}

module.exports = decorateHtmlResponse;
