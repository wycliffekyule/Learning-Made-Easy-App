import React, { useState } from 'react';
import { Check, Star, Zap, Crown, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Free',
      icon: Star,
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      features: [
        '3 assessments per month',
        'Basic AI tutor chat (10 questions/day)',
        '1 assignment submission',
        'Progress tracking',
        'Email support'
      ],
      limitations: [
        'Limited subject coverage',
        'Basic feedback only'
      ],
      popular: false,
      color: 'gray'
    },
    {
      name: 'Student Pro',
      icon: Zap,
      price: { monthly: 9.99, yearly: 79.99 },
      description: 'Ideal for regular learners',
      features: [
        'Unlimited assessments',
        'Advanced AI tutor (unlimited questions)',
        '10 assignment submissions/month',
        'Detailed progress analytics',
        'All subjects included',
        'Priority email support',
        'Study reminders'
      ],
      popular: true,
      color: 'blue'
    },
    {
      name: 'Academic Elite',
      icon: Crown,
      price: { monthly: 19.99, yearly: 159.99 },
      description: 'For serious academic improvement',
      features: [
        'Everything in Student Pro',
        'Unlimited assignment submissions',
        'Advanced AI explanations',
        'Custom study plans',
        '1-on-1 virtual sessions',
        'Parent progress reports',
        'Exam preparation tools',
        'Priority chat support'
      ],
      popular: false,
      color: 'purple'
    }
  ];

  const handleSubscribe = (planName: string) => {
    // Integration with payment systems would be handled here
    alert(`Subscribe to ${planName} - Payment integration will be set up with Stripe and IntaSend`);
  };

  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border') => {
    const colorMap = {
      gray: {
        bg: 'bg-gray-600',
        text: 'text-gray-600',
        border: 'border-gray-300'
      },
      blue: {
        bg: 'bg-blue-600',
        text: 'text-blue-600',
        border: 'border-blue-300'
      },
      purple: {
        bg: 'bg-purple-600',
        text: 'text-purple-600',
        border: 'border-purple-300'
      }
    };
    return colorMap[color as keyof typeof colorMap][variant];
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Learning Plan
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Unlock your full potential with AI-powered personalized education. 
          Start free and upgrade as you grow.
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            Yearly
          </span>
          {billingCycle === 'yearly' && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
              Save 33%
            </span>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`relative bg-white rounded-2xl shadow-lg p-8 border-2 transition-all hover:shadow-xl ${
              plan.popular ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                plan.color === 'gray' ? 'bg-gray-100' :
                plan.color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'
              }`}>
                <plan.icon className={`w-8 h-8 ${getColorClasses(plan.color, 'text')}`} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${plan.price[billingCycle]}
                </span>
                <span className="text-gray-600 ml-1">
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
              {plan.limitations?.map((limitation, limitIndex) => (
                <li key={limitIndex} className="flex items-center text-gray-500">
                  <div className="w-5 h-5 mr-3 flex items-center justify-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                  <span>{limitation}</span>
                </li>
              ))}
            </ul>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSubscribe(plan.name)}
              className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                plan.popular
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              {plan.price[billingCycle] === 0 ? 'Start Free' : 'Subscribe Now'}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h4>
            <p className="text-gray-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h4>
            <p className="text-gray-600 text-sm">Our Free plan lets you explore the platform. Premium features have a 7-day free trial.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
            <p className="text-gray-600 text-sm">We accept all major credit cards, PayPal, and mobile money through IntaSend.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h4>
            <p className="text-gray-600 text-sm">Yes, you can cancel your subscription anytime with no cancellation fees.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;