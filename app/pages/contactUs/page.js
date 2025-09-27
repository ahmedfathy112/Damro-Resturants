"use client";
import { Mail, MapPin, PhoneCall } from "lucide-react";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";

const ContactUs = () => {
  const formRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const result = await emailjs.sendForm(
        "service_ba1al1c",
        "template_lcuiv89",
        formRef.current,
        "Qy_gtKV_i7kNrc_-_"
      );

      Swal.fire({
        icon: "succses",
        title: "نجاح",
        text: "تم إرسال الرساله بنجاح!",
      });
      setSubmitMessage("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
      formRef.current.reset();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "فشل ارسال الرساله",
        footer: "<p>الخطأ: ${error}</p>",
      });
      setSubmitMessage(
        "عذراً، حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="w-full h-screen py-4 px-5" dir="rtl">
      {/* head title */}
      <div className="w-full flex justify-center items-center flex-col mb-7">
        <h1 className="text-3xl font-semibold mb-3 text-center">تواصل معنا</h1>
        <p className="text-[16px] font-medium text-gray-500">
          يمكنك ادخال بياناتك وارسال رساله لنا
        </p>
      </div>
      {/* main content */}
      <div className="w-full flex flex-row max-md:flex-col">
        {/* contact info */}
        <div className="w-1/2 bg-black py-3 px-4 flex flex-col justify-evenly text-right rounded-2xl max-md:w-full max-md:py-5 max-md:px-3">
          {/* contact info title */}
          <div className="w-full text-center flex flex-col mb-6">
            <h3 className="text-2xl font-medium mb-2 text-white">
              معلومات التواصل
            </h3>
            <p className="text-[16px] font-medium text-gray-400">
              أبدا محادثه معنا الأن
            </p>
          </div>
          {/* contact info content */}
          <div className="w-full flex flex-col text-white">
            {/* Phone */}
            <div className="w-full flex flex-row mb-3 justify-center">
              <PhoneCall className="text-2xl my-auto" />
              <span className="text-[18px] font-medium mr-2 max-md:text-[14px]">
                +201060733679
              </span>
            </div>
            {/* Email */}
            <div className="w-full flex flex-row mb-3 justify-center">
              <Mail className="text-2xl my-auto" />
              <span className="text-[18px] font-medium mr-2 max-md:text-[14px]">
                ahmedfathy241110@gmail.com
              </span>
            </div>
            {/* Address */}
            <div className="w-full flex flex-row mb-3 justify-center">
              <MapPin className="text-2xl my-auto" />
              <span className="text-[18px] font-medium mr-2 max-md:text-[14px]">
                Gharbia Governorate - El Mahalla El Kubra
              </span>
            </div>
          </div>
        </div>
        {/* contact form */}
        <div className="w-1/2 py-3 px-4 mr-4 max-md:w-full max-md:mr-0 max-md:mt-6">
          <form
            ref={formRef}
            onSubmit={sendEmail}
            className="flex flex-col w-full text-right"
          >
            {/* full name */}
            <div className="flex flex-col w-full mb-4 max-md:mb-6">
              <label
                title="أدخل أسمك بالكامل"
                className="font-medium text-[17px] text-gray-400 mb-2 text-right"
              >
                الأسم بالكامل
              </label>
              <input
                name="user_name"
                placeholder="أدخل هنا أسمك بالكامل"
                type="text"
                required
                className="border-0 border-b-2 py-1.5 px-2 w-full outline-0 focus:border-b-blue-400"
              />
            </div>

            {/* email */}
            <div className="flex flex-col w-full mb-4 max-md:mb-6">
              <label
                title="أدخل بريدك الالكتروني"
                className="font-medium text-[17px] text-gray-400 mb-2 text-right"
              >
                البريد الالكتروني
              </label>
              <input
                name="user_email"
                placeholder="أدخل هنا بريدك الاكتروني"
                type="email"
                required
                className="border-0 border-b-2 py-1.5 px-2 w-full outline-0 focus:border-b-blue-400"
              />
            </div>

            {/* message content */}
            <div className="flex flex-col w-full mb-4 max-md:mb-6">
              <label
                title="أدخل رسالتك"
                className="font-medium text-[17px] text-gray-400 mb-2 text-right"
              >
                مضمون الرسالة
              </label>
              <textarea
                name="message"
                placeholder="أدخل هنا مضمون رسالتك"
                rows={4}
                required
                className="border-0 border-b-2 py-1.5 px-2 w-full outline-0 focus:border-b-blue-400"
              />
            </div>

            {/* send message btn */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-[18px] cursor-pointer font-medium text-white bg-black border-0 outline-0 py-2 px-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "جاري الإرسال..." : "إرسال"}
            </button>

            {submitMessage && (
              <div
                className={`mt-4 p-3 rounded text-center ${
                  submitMessage.includes("نجاح")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {submitMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
