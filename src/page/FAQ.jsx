// src/page/FAQ.jsx
export default function FAQ() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10 text-primary">
          Frequently Asked Questions (FAQ)
        </h1>
  
        {/* General Questions */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">General Questions</h2>
  
          <details className="mb-4 border-b border-gray-200 pb-4">
            <summary className="font-medium cursor-pointer text-lg">
              What is WhistleWorks?
            </summary>
            <p className="mt-3 text-gray-700">
              WhistleWorks is a centralized platform designed to connect sports officials with officiating camps and training opportunities. Officials can easily discover camps, register, manage their schedule, and track their development — all in one place.
            </p>
          </details>
  
          <details className="mb-4 border-b border-gray-200 pb-4">
            <summary className="font-medium cursor-pointer text-lg">
              Who can use WhistleWorks?
            </summary>
            <p className="mt-3 text-gray-700">
              WhistleWorks is designed for:
            </p>
            <ul className="mt-2 list-disc pl-6 text-gray-700 space-y-1">
              <li>Sports officials looking to improve their skills and attend officiating camps</li>
              <li>Camp coordinators who want a streamlined way to manage registrations, schedules, and officials</li>
              <li>Camp staff (Evaluators) who want an easy and effective way of evaluating officials.</li>
            </ul>
          </details>
  
          <details className="mb-4 border-b border-gray-200 pb-4">
            <summary className="font-medium cursor-pointer text-lg">
              What sports does WhistleWorks support?
            </summary>
            <p className="mt-3 text-gray-700">
              Currently, WhistleWorks focuses on basketball officiating camps, with plans to expand into additional sports in the future.
            </p>
          </details>
        </section>
  
        {/* Account & Registration */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Account & Registration</h2>
  
          <details className="mb-4 border-b border-gray-200 pb-4">
            <summary className="font-medium cursor-pointer text-lg">
              How do I create an account?
            </summary>
            <p className="mt-3 text-gray-700">
              Visit www.whistleworks.org and click Sign Up. After entering your information, you will receive a one-time passcode (OTP) via email to verify your account.
            </p>
          </details>
  
          <details className="mb-4 border-b border-gray-200 pb-4">
            <summary className="font-medium cursor-pointer text-lg">
              Does creating an account reserve my spot in a camp?
            </summary>
            <p className="mt-3 text-gray-700">
              No. Creating an account does not reserve a spot in any camp. To attend a camp, you must register for the specific camp through the platform.
            </p>
          </details>
  
          <details className="mb-4 border-b border-gray-200 pb-4">
            <summary className="font-medium cursor-pointer text-lg">
              Where can I see the camps I registered for?
            </summary>
            <p className="mt-3 text-gray-700">
              Once registered, you can view your camps by clicking My Camps in your dashboard. Your registered camps will appear under the Registered tab.
            </p>
          </details>
  
          <details className="mb-4 border-b border-gray-200 pb-4">
            <summary className="font-medium cursor-pointer text-lg">
              When can I check in to a camp?
            </summary>
            <p className="mt-3 text-gray-700">
              The Check-In feature becomes available 24 hours before the start date of the camp.
            </p>
          </details>
        </section>
  
        {/* Camp Registration */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Camp Registration</h2>
  
          <details className="mb-4 border-b border-gray-200 pb-4">
            <summary className="font-medium cursor-pointer text-lg">
              How do I register for a camp?
            </summary>
            <ol className="mt-3 text-gray-700 list-decimal pl-6 space-y-1">
              <li>Log into your WhistleWorks account</li>
              <li>Browse available camps</li>
              <li>Select the camp you want to attend</li>
              <li>Complete the registration and payment process</li>
            </ol>
          </details>
  
          <details className="mb-4 border-b border-gray-200 pb-4">
            <summary className="font-medium cursor-pointer text-lg">
              What happens after I register?
            </summary>
            <p className="mt-3 text-gray-700">
              After successful registration you will receive:
            </p>
            <ul className="mt-2 list-disc pl-6 text-gray-700 space-y-1">
              <li>A registration confirmation email</li>
              <li>A payment receipt</li>
              <li>Access to the camp inside your My Camps dashboard</li>
            </ul>
          </details>
  
          <details className="mb-4 border-b border-gray-200 pb-4">
            <summary className="font-medium cursor-pointer text-lg">
              I didn’t receive my confirmation email. What should I do?
            </summary>
            <p className="mt-3 text-gray-700">
              First, check your spam or junk folder. If you still cannot find it, contact support.
            </p>
          </details>
        </section>
  
        {/* Payments */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Payments</h2>
  
          <details className="mb-4 border-b border-gray-200 pb-4">
            <summary className="font-medium cursor-pointer text-lg">
              What payment methods are accepted?
            </summary>
            <p className="mt-3 text-gray-700">
              Payments are processed securely online through our payment system. Accepted payment methods may include major credit and debit cards.
            </p>
          </details>
  
          <details className="mb-4 border-b border-gray-200 pb-4">
            <summary className="font-medium cursor-pointer text-lg">
              Is my payment secure?
            </summary>
            <p className="mt-3 text-gray-700">
              Yes. Payments are processed through our “Stripe” payment gateway to ensure your information is protected.
            </p>
          </details>
  
          <details className="mb-4 border-b border-gray-200 pb-4">
            <summary className="font-medium cursor-pointer text-lg">
              Can I get a refund if I cannot attend?
            </summary>
            <p className="mt-3 text-gray-700">
              Refund policies are determined by the individual camp operator. Please refer to the specific camp’s refund policy listed during registration.
            </p>
          </details>
        </section>
  
        {/* Camp Experience */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Camp Experience</h2>
  
          <details className="mb-4 border-b border-gray-200 pb-4">
            <summary className="font-medium cursor-pointer text-lg">
              How will I receive my game schedule?
            </summary>
            <p className="mt-3 text-gray-700">
              Camp schedules and assignments will be available inside your camp dashboard within WhistleWorks.
            </p>
          </details>
        </section>
  
        {/* For Camp Directors */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">For Camp Directors</h2>
  
          <details className="mb-4 border-b border-gray-200 pb-4">
            <summary className="font-medium cursor-pointer text-lg">
              Why should camps use WhistleWorks?
            </summary>
            <p className="mt-3 text-gray-700">
              WhistleWorks helps camps:
            </p>
            <ul className="mt-2 list-disc pl-6 text-gray-700 space-y-1">
              <li>Manage registrations and payments</li>
              <li>Real time evaluations</li>
              <li>Communicate with officials</li>
              <li>Automatically assign games</li>
              <li>Keep all camp logistics organized in one place</li>
            </ul>
          </details>
  
          <details className="mb-4 border-b border-gray-200 pb-4">
            <summary className="font-medium cursor-pointer text-lg">
              How do I add my camp to WhistleWorks?
            </summary>
            <p className="mt-3 text-gray-700">
              If you are interested in listing your camp, please contact us through the chatbot in the lower right hand of the screen to get started.
            </p>
          </details>
        </section>
  
        {/* Technical Questions */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Technical Questions</h2>
  
          <details className="mb-4 border-b border-gray-200 pb-4">
            <summary className="font-medium cursor-pointer text-lg">
              What should I do if I experience a technical issue?
            </summary>
            <p className="mt-3 text-gray-700">
              If you experience a bug or issue while using the platform, please contact support via our chatbot with:
            </p>
            <ul className="mt-2 list-disc pl-6 text-gray-700 space-y-1">
              <li>A description of the issue</li>
              <li>The page you were on</li>
              <li>A screenshot if possible</li>
            </ul>
          </details>
  
          <details className="mb-4 border-b border-gray-200 pb-4">
            <summary className="font-medium cursor-pointer text-lg">
              What devices can I use WhistleWorks on?
            </summary>
            <p className="mt-3 text-gray-700">
              WhistleWorks works on:
            </p>
            <ul className="mt-2 list-disc pl-6 text-gray-700 space-y-1">
              <li>Desktop computers</li>
              <li>Tablets</li>
              <li>Mobile devices</li>
            </ul>
          </details>
        </section>
  
        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Contact</h2>
          <p className="text-gray-700">
            If you have any questions not covered in this FAQ, please contact us through our chatbot at the bottom right corner of the screen.
          </p>
        </section>
      </div>
    );
  }