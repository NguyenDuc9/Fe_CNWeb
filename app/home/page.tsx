
export default function Home() {
  return (
    <div>
      <>
        {/* basic */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* mobile metas */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="viewport" content="initial-scale=1, maximum-scale=1" />
        {/* site metas */}
        <title>Blog</title>
        <meta name="keywords" content="" />
        <meta name="description" content="" />
        <meta name="author" content="" />
        {/* bootstrap css */}
        <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" />
        {/* style css */}
        <link rel="stylesheet" type="text/css" href="css/style.css" />
        {/* Responsive*/}
        <link rel="stylesheet" href="css/responsive.css" />
        {/* fevicon */}
        <link rel="icon" href="images/fevicon.png" type="image/gif" />
        {/* font css */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap"
          rel="stylesheet"
        />
        {/* Scrollbar Custom CSS */}
        <link rel="stylesheet" href="css/jquery.mCustomScrollbar.min.css" />
        {/* Tweaks for older IEs*/}
        <link
          rel="stylesheet"
          href="https://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css"
        />
        <div className="header_section header_bg">
          <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <a className="navbar-brand" href="index.html">
                <img src="images/logo.png" />
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <a className="nav-link" href="index.html">
                      Home
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="about.html">
                      About
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="coffees.html">
                      Coffees
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="shop.html">
                      Shop
                    </a>
                  </li>
                  <li className="nav-item active">
                    <a className="nav-link" href="blog.html">
                      Blog
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="contact.html">
                      Contact
                    </a>
                  </li>
                </ul>
                <form className="form-inline my-2 my-lg-0">
                  <div className="login_bt">
                    <ul>
                      <li>
                        <a href="#">
                          <span className="user_icon">
                            <i className="fa fa-user" aria-hidden="true" />
                          </span>
                          Login
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-search" aria-hidden="true" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </form>
              </div>
            </nav>
          </div>
        </div>
        {/* header section end */}
        {/* blog section start */}
        <div className="blog_section layout_padding">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1 className="about_taital">Our Blog</h1>
                <div className="bulit_icon">
                  <img src="images/bulit-icon.png" />
                </div>
              </div>
            </div>
            <div className="blog_section_2">
              <div className="row">
                <div className="col-md-6">
                  <div className="blog_box">
                    <div className="blog_img">
                      <img src="images/blog-img1.png" />
                    </div>
                    <h4 className="date_text">05 April</h4>
                    <h4 className="prep_text">PREP TECHNIQUES Coffee</h4>
                    <p className="lorem_text">
                      distracted by the readable content of a page when looking
                      at its layout. The point of using Lorem Ipsum is that it
                      has a moredistracted by the readable content of a page
                      when looking at its layout. The point of using Lorem Ipsum
                      is that it has a more
                    </p>
                  </div>
                  <div className="read_bt">
                    <a href="#">Read More</a>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="blog_box">
                    <div className="blog_img">
                      <img src="images/blog-img2.png" />
                    </div>
                    <h4 className="date_text">05 April</h4>
                    <h4 className="prep_text">PREP TECHNIQUES Coffee</h4>
                    <p className="lorem_text">
                      distracted by the readable content of a page when looking
                      at its layout. The point of using Lorem Ipsum is that it
                      has a moredistracted by the readable content of a page
                      when looking at its layout. The point of using Lorem Ipsum
                      is that it has a more
                    </p>
                  </div>
                  <div className="read_bt">
                    <a href="#">Read More</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* blog section end */}
        {/* footer section start */}
        <div className="footer_section layout_padding">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1 className="address_text">Address</h1>
                <p className="footer_text">
                  here, content here', making it look like readable English.
                  Many desktop publishing packages and web page editors now
                  use{' '}
                </p>
                <div className="location_text">
                  <ul>
                    <li>
                      <a href="#">
                        <i className="fa fa-phone" aria-hidden="true" />
                        <span className="padding_left_10">+01 1234567890</span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-envelope" aria-hidden="true" />
                        <span className="padding_left_10">demo@gmail.com</span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="form-group">
                  <textarea
                    className="update_mail"
                    placeholder="Your Email"
                    rows={5}
                    id="comment"
                    name="Your Email"
                    defaultValue={''}
                  />
                  <div className="subscribe_bt">
                    <a href="#">
                      <img src="images/teligram-icon.png" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* footer section end */}
        {/* copyright section start */}
        <div className="copyright_section">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-sm-12">
                <p className="copyright_text">
                  2020 All Rights Reserved. Design by{' '}
                  <a href="https://html.design">Free Html Templates</a>
                </p>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="footer_social_icon">
                  <ul>
                    <li>
                      <a href="#">
                        <i className="fa fa-facebook" aria-hidden="true" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-twitter" aria-hidden="true" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-linkedin" aria-hidden="true" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-instagram" aria-hidden="true" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* copyright section end */}
        {/* Javascript files*/}
        {/* sidebar */}
      </>
    </div>
  );
}
