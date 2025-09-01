import React from "react";

const AIMachineTypes = () => {
  return (
    <section id="ai-machine-types" className="py-12 px-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Types of AI Machines
      </h2>

      {/* Reactive Machines */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Reactive machines
        </h3>
        <p className="text-gray-700 text-base">
          Reactive machines react to their environment with pre-programmed
          responses. These machines can be used in anything from smart
          thermostats to chess-playing computers.
        </p>
      </div>

      {/* Limited Memory Machines */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Limited memory machines
        </h3>
        <p className="text-gray-700 text-base">
          Limited memory machines use information from past experiences to make
          decisions or create an output. These machines are a bit more advanced
          than reactive counterparts. Think about the spam filter in your email.
          The filter has some sort of initial training to identify spam, and it
          keeps track of things like sender addresses, keywords, and suspicious
          attachments. It uses this training and short-term memory to send new
          emails either to the spam folder or to your inbox.
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-gray-800">
        <p>
          All of the AI systems we know of today are either reactive or limited
          memory machines. While they might seem simple on paper, they are
          revolutionizing the way that brands do business online.
        </p>
        <p className="mt-2">
          Let’s look at some of the practical implications of these machines,
          and how they’re impacting fashion ecommerce.
        </p>
      </div>
    </section>
  );
};

export default AIMachineTypes;
