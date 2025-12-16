import { getRandomInterviewCover } from '@/lib/utils'
import Image from 'next/image'
import dayjs from "dayjs";
import React from 'react'
import { Button } from "./ui/button";
import Link from "next/link";
import DisplayTechIcons from './DisplayTechIcons';
const InterviewCard = ({ interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,}: InterviewCardProps) => {
     const formattedDate = dayjs(
      createdAt
  ).format("MMM D, YYYY");
  return (
    <div className='card-border w-[360px] max-sm:w-full min-h-96'>
        <div className='card-interview'>
            <div>
                <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600'>
                    <p className='badge-text'>{type}</p>
                </div>
                <Image src={getRandomInterviewCover()} alt='cover image' width={90} height={90} 
                className='rounded-full object-fit' />

                <h3 className='mt-5 capitalize'>
                    {role} Intervew
                </h3>
                <div className='flex flex-row gap-5 mt-3'>
                    <div className='flex flex-row gap-2'>
                        <Image src='/calendar.svg' alt='calendar' width={22} height={22} />
                        <p>{formattedDate}</p>
                    </div>

                    <div className='flex flex-row gap-2 items-center'>
                        <Image  src='/star.svg' alt='star' width={22} height={22} />
                        <p>---/100</p>
                    </div>
                </div>

                <p className='line-clamp-2'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                     Quaerat unde magnam repellat aliquid dolores veritatis 
                     numquam libero voluptatem explicabo natus. </p>
            </div>

            <div className='flex flex-row justify-between'>
                <DisplayTechIcons techStack={techstack} />
                <Button className='btn-parimary'>
                    <Link href='/'>View Interview</Link>
                </Button>
            </div>

        </div>
    </div>
  )
}

export default InterviewCard