import React from 'react'



function Footer() {
    return (
        <div className="container-fluid bg-dark text-light footer mt-5 pt-5 wow fadeIn" data-wow-delay="0.1s">
            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-lg-3 col-md-4">
                        <h5 className="text-light mb-4">Address</h5>
                        <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+880 1798-052279</p>
                        <p className="mb-2"><i className="fa fa-envelope me-3"></i>shureedshazzad534@gmail.com</p>
                    </div>
                    <div className="col-lg-9 col-md-6" style={{ marginTop: "100px" }}>
                    At QuizNexus, our mission is to ignite curiosity and foster learning through the power of engaging quizzes. We invite you to be part of a community that values knowledge, challenges, and growth. Your participation will not only enhance your intellect but also inspire others to embark on their own journey of discovery. Join us in creating a world of smarter, more informed individuals, one quiz at a time!
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="copyright">
                    <div className="row">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            &copy; <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>quizNexus.com</a>, All Right Reserved.
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            Developed By 
                            <a href="https://www.linkedin.com/in/shureed-shazzad-663b17245/" style={{ color: '#3498db', textDecoration: 'none' }}> Shureed Shazzad</a>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer