import Image from 'next/image'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-faqs.jpg'

const faqs = [
  [
    {
      question: 'How does Observa work?',
      answer:
        'Observa turns your old smartphones into security cameras. Simply install the Observa app on your old and current phones. The old phone acts as the camera, and the new one serves as the viewer.',
    },
    {
      question: 'Is Observa compatible with both Android and iOS devices?',
      answer: 'Yes, Observa works seamlessly with both Android and iOS devices, making setup and usage straightforward regardless of your smartphone platform.',
    },
    {
      question: 'Can I use multiple cameras with Observa?',
      answer: 'Absolutely! Observa supports multiple cameras, allowing you to monitor different areas of your property simultaneously.',
    },
  ],
  [
    {
      question: 'How secure is the cloud storage?',
      answer: 'Our cloud storage is highly secure and encrypted, ensuring your recorded videos are protected and accessible only to you.',
    },
    {
      question: 'What happens if motion is detected?',
      answer: 'When motion is detected, Observa sends instant alerts to your device, allowing you to check the live feed or recorded footage immediately.',
    },
    {
      question: 'Does Observa support night vision?',
      answer: 'Yes, Observa supports night vision, enabling you to monitor your property even in low-light conditions.',
    },
  ],
  [
    {
      question: 'Can I communicate through the Observa cameras?',
      answer: 'Yes, Observa includes a two-way audio feature, allowing you to communicate through the camera. This is useful for scaring off intruders or talking to family members or pets.',
    },
    {
      question: 'What are the cloud storage plans available?',
      answer: 'Observa offers both free and premium cloud storage plans. The premium plans provide more storage space and additional features.',
    },
    {
      question: 'How do I get started with Observa?',
      answer: 'Getting started is easy! Download the Observa app on both your old and current smartphones, follow the setup instructions, and start monitoring your property in minutes.',
    },
  ],
];


export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <Image
        className="absolute left-1/2 top-0 max-w-none -translate-y-1/4 translate-x-[-30%]"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            If you can’t find what you’re looking for, email our support team
            and if you’re lucky someone will get back to you.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-display text-lg leading-7 text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
