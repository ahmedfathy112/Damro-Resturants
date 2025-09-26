import Link from "next/link";
import React from "react";

const AboutUs = () => {
  return (
    <div className="w-full flex flex-col py-4 px-6 mt-5 ">
      {/* heading */}
      <div className="w-full relative border-[1px] border-b-0 rounded-4xl py-4 px-7 text-center max-md:px-4">
        <h1 className="absolute font-sans -top-[50px] right-[40%] bg-white text-[67px] font-extrabold py-1.5 px-2 max-md:text-3xl max-md:-top-[30px] max-md:right-[35%]">
          ماذا عنا؟
        </h1>
        <p className="text-[16px] text-gray-500 font-medium mt-12">
          هدفنا إننا نوصل الأكل المفضل ليك بطريقة سهلة وسريعة، مع تجربة تخلي
          التواصل بين العميل والمطعم أبسط
        </p>
      </div>
      {/* first sec */}
      <div className="w-full flex flex-row justify-between mt-10 max-md:flex-col-reverse">
        {/* first sec image */}
        <div className="w-1/2 max-md:w-full">
          <img src="/images/aboutUsImage.png" alt="aboutUsImage" />
        </div>
        <div className="w-1/2 flex items-center flex-col justify-between max-md:w-full">
          {/* first sec content */}
          <h1 className="text-center font-bold text-6xl font-stretch-expanded max-md:mb-3">
            رؤيتنا <br /> وقيمتنا
          </h1>
          <p className="text-right text-[17px] text-gray-400 max-md:mb-3">
            مهمتنا بسيطة: إننا نوفر أعلى مستوى من الخدمة والجودة في عالم توصيل
            الطعام. بنلتزم دايمًا نحط احتياجات عملائنا في المقام الأول، ونضمن إن
            تجربتهم على المنصة تكون سهلة، ناجحة، وممتعة. قيمنا الأساسية من
            شفافية، أمانة، وتركيز على رضا العميل هي اللي بتحرك كل خطوة بنعملها
          </p>
          {/* link to all resturant page */}
          <Link
            href="/pages/allResturants"
            className="aboutUs-btn p-7 rounded-b-full text-center border-[1px] cursor-pointer outline-0 text-[20px] font-semibold"
          >
            أستكشاف
          </Link>
        </div>
      </div>
      {/* last sec */}
      <div className="lastSec-about w-full flex flex-row justify-between mt-10 max-md:flex-col max-md:mt-16">
        <div className="w-1/2 flex items-center flex-col justify-between max-md:w-full">
          {/* last sec content */}
          <h1 className="text-center font-bold text-6xl font-stretch-expanded max-md:mb-4">
            إرث <br /> من التميز
          </h1>
          <p className="text-right text-[17px] text-gray-400 max-md:mb-4">
            تأسست Damro في عام 2025 بهدف تبسيط تجربة طلب وتوصيل الطعام. من
            البداية، سعينا نخلق منصة تجمع بين العملاء والمطاعم في مكان واحد،
            بحيث يقدر كل شخص يوصل بسهولة لوجباته المفضلة ويستمتع بخدمة سريعة
            وموثوقة. خلال رحلتنا ساعدنا آلاف المستخدمين والمطاعم على التواصل
            بشكل أفضل، وحرصنا دايمًا على إن تكون تجربتهم معنا سلسة، ممتعة،
            ومليانة ثقة. التزامنا الدائم بالجودة ورضا العميل هو اللي شكّل هويتنا
            ودفعنا للاستمرار في تقديم الأفضل
          </p>
          {/* link to home page */}
          <Link
            href="/"
            className="aboutUs-btn p-7 rounded-b-full text-center border-[1px] cursor-pointer outline-0 text-[20px] font-semibold"
          >
            أستكشاف
          </Link>
        </div>
        {/* image of last sec */}
        <div className="w-1/2 flex justify-end max-md:justify-center max-md:w-full">
          <img src="/images/aboutUsImage2.png" alt="aboutUsImage2" />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
