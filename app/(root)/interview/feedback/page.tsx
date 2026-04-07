import React from "react";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

const Page = () => {
  return (
    <section className="section-feedback">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview -{" "}
          <span className="capitalize">Frontend Developer Intervew</span>{" "}
          Interview
        </h1>
      </div>

      <div className="flex flex-row justify-center ">
        <div className="flex flex-row gap-5">
          {/* Overall Impression */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" width={22} height={22} alt="star" />
            <p>
              Overall Impression:{" "}
              <span className="text-primary-200 font-bold">85</span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>October 23, 2025</p>
          </div>
        </div>
      </div>

      <hr />

      <p>
        This interview does not reflect serious interest or engagement from the
        candidate. Their responses are dismissive, vague, or outright negative,
        making it difficult to assess their qualifications, motivation, or
        suitability for the role.
      </p>

      {/* Interview Breakdown */}
      <div className="flex flex-col gap-4">
        <h2>Breakdown of the Interview:</h2>

        <div>
          <p className="font-bold">1. Communication Skills (20/100)</p>
          <p>
            The candidate's communication was poor. They avoided answering
            questions directly and often made jokes or promotional plugs instead
            of providing substantive responses. There was a lack of structured
            responses and clear articulation
          </p>
        </div>
        <div>
          <p className="font-bold">2. Technical Knowledge (25/100)</p>
          <p>
            The condidate demonstrated some basic technical knowledge by
            mentioning Next js and its features. However, they failed to
            elaborate or provide specific examples, indicating a superficial
            understanding. They did not demonstrate the depth of knowledge
            expected for a full-stock role.
          </p>
        </div>
        <div>
          <p className="font-bold">3. Problem Solving (10/100)</p>
          <p>
            The candidate showed very little problem-solving ability. They
            avoided addressing the questions directly and did not offer any
            solutions or approaches to the problems posed. When faced with a
            challenging question, they admitted they needed to practice,
            indicating a lack of preparedness.
          </p>
        </div>
        <div>
          <p className="font-bold">4. Cultural Fit (10/100)</p>
          <p>
            The candidate's behavior and responses suggest a poor cultural fit.
            Their dismissive attitude, lack of engagement, and promotional plugs
            are not aligned with professional interview etiquette. They did not
            demonstrate respect for the interviewer's time or the interview
            process
          </p>
        </div>
        <div>
          <p className="font-bold">5. Confidence and Clarity (10/100)</p>
          <p>
            The candidate lacked confidence and clarity in their responses. They
            frequently deflected questions and avoided providing detailed
            answers. Their responses were often vague and lacked substance,
            giving the impression that they were unprepared or unwilling to
            engage in a meaningful discussion.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3>Areas for Improvement</h3>
        <ul>
          Improve communication skills by providing clear, structured, and relevant responses.
        </ul>
        <ul>
          Deepen technical knowledge and be prepared to provide specific examples and details
        </ul>
        <ul>
          Develop problem-solving skills by practicing analyzing problems and proposing solutions.
        </ul>
        <ul>
          Demonstrate professionalism and respect for the interview process.
        </ul>
        <ul>
          Prepare thoroughly for interviews and be ready to answer questions in detail
        </ul>
      </div>

      <div className="buttons">
        <Button className="btn-secondary flex-1">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Back to dashboard
            </p>
          </Link>
        </Button>

        <Button className="btn-primary flex-1">
          <Link
            href={`/interview`}
            className="flex w-full justify-center"
          >
            <p className="text-sm font-semibold text-black text-center">
              Retake Interview
            </p>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Page;
