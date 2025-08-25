
import '../../assets/css/home.css';
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeZoomIn } from "../../animations/motionVariants";
import SnowEffect from '../../animations/SnowEffect';
import { useInView } from "framer-motion";
import darkLogo from '../../assets/images/darklogo.png'; // Adjust
import { useNavigate } from "react-router-dom";
import UniqueCodeInput from '../../components/UniqueCodeInput';
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const revealTextSectionRef = useRef(null);
  // trigger when element is ~50% in viewport (centered effect)
  const isInView = useInView(revealTextSectionRef, { amount: 0.5 });
  // Scroll tracking for main circle overlay
  const { scrollYProgress: circleProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(circleProgress, [0, 1], ["0%", "100%"]);
  const scale = useTransform(circleProgress, [0, 1], [1, 1.2]);

  // Scroll tracking for text reveal
  // const { scrollYProgress: textProgress } = useScroll({
  //   target: revealTextSectionRef,
  //   offset: ["start end", "end start"], // fade in/out timing
  // });

  // const opacity = useTransform(textProgress, [0, 0.1], [0, 1]);
  // const y = useTransform(textProgress, [0, 0.3], [10, 0]);
  return (
    <>
      <div className=".landing-body" style={{ backgroundColor: '#000000' }}>
        {/* hero banner section start */}
        <section
          className="section.is-hero w-[100%]   min-h-[100dvh] h-full overflow-hidden"
          style={{ overflow: "hidden" }}
        >
          <SnowEffect />

          <div className=" min-h-[100dvh] inner-hero-section flex flex-col pt-[4rem] pb-[4rem] relative z-[2]">
            <div className="aitheinfi-container w-[100%] max-w-[90rem] mx-auto px-2 md:px-[6rem] relative ">
              <motion.h1
                className="
    gradient-text
    uppercase
    font-normal
    leading-[1.2]
    text-center
    mb-4
    text-[clamp(2rem,6vw,4.5rem)]
    text-balance
  "
                variants={fadeZoomIn}
                initial="hidden"
                animate="visible"
              >
                Meet the financial system of the future
              </motion.h1>

              <div className="z-[2] flex flex-col justify-center items-center gap-[10px]">
                {/* ...content... */}

                {/* <p className="gradient-paragraph mb-0 text-[clamp(.875rem,3vw,1rem)] text-balance">
                Enter Code
              </p> */}
                {/* <input
                type="text"
                maxLength={10}
                pattern="\d{10}"
                inputMode="numeric"
                placeholder="Enter Code"
                onChange={(e) => console.log(e.target.value)}
                className="unique-code-input relative z-[10] w-50 px-4 py-2 rounded-lg  mt-5
             outline-none transition duration-300
             focus:border-none focus:outline-none
             focus:[animation:input-glow_1.4s_ease-in-out_infinite] text-center"
              /> */}

                <UniqueCodeInput />

                {/* <p className="gradient-paragraph mt-20 text-[clamp(.875rem,3vw,1rem)] text-balance text-center relative z-[10]">
                Scroll Down
              </p> */}
              </div>
            </div>
            <div className="hero_aurora">
              <div className="hero_aurora-inner"></div>
            </div>
            <div className="hero_aurora is-blured">
              <div className="hero_aurora-inner"></div>
            </div>
          </div>
        </section>

        <section
          ref={sectionRef}
          className="relative z-[99] h-[500px] bg-[#000000] mt-0 md:mt-[4rem]"
        >
          <div className="aitheinfi-container w-[100%] max-w-[90rem] mx-auto px-2 md:px-[6rem] relative">
            <div className="overview-wrapper flex flex-col justify-start items-center mx-auto max-w-[55rem] ">
              <div className="overflow-hidden">
                <div className="headline_circle">
                  <div className="headline_circle-inner"></div>

                  {/* Motion overlay */}
                  <motion.div
                    className="headline_circle-overlay absolute top-0 left-0 w-[100%] h-[100%] bg-black opacity-90"
                    style={{
                      y: translateY,
                      scale,
                      // rotate,
                    }}
                  />
                </div>
              </div>
              <div
                ref={revealTextSectionRef}
                className="w-[100%] max-w-[768px]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                  }
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col justify-center align-center items-center mt-10 text-center"
                >
                  <img
                    src={darkLogo}
                    className="my-4 mt-0"
                    style={{ width: "100px" }}
                  />

                  <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                    }
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-2xl font-bold mb-4"
                  >
                    Overview
                  </motion.h2>
                  <motion.p
                    className=" leading-relaxed"
                    initial={{ opacity: 0, y: 50 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                    }
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ textWrap: "balance" }}
                  >
                    <strong>What is Bitcoin?</strong>
                    <br />
                    Bitcoin uses peer-to-peer technology to operate with no
                    central authority or banks. Managing transactions and the
                    issuing of bitcoins is carried out collectively by the
                    network. Bitcoin is open-source. Its design is public,
                    nobody owns or controls Bitcoin and everyone can take part.
                    Through many of its unique properties, Bitcoin allows
                    exciting uses that could not be covered by any previous
                    payment system.
                  </motion.p>

                  <button
                    className="button"
                    onClick={() => navigate("/welcome")}
                  >
                    <div className="button_inner">
                      <p>Get Started</p>
                    </div>
                    <div className="button-glow"></div>
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage
