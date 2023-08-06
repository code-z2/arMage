import { SocialIcon } from 'react-social-icons';

const Footer = () => {
  const footerNavs = [
    {
      href: 'javascript:void()',
      name: 'About',
    },
    {
      href: 'javascript:void()',
      name: 'Blog',
    },
    {
      href: 'javascript:void()',
      name: 'Github',
    },
    {
      href: 'javascript:void()',
      name: 'Build with Friends',
    },

    {
      href: 'javascript:void()',
      name: 'Hack',
    },
  ];

  return (
    <footer className="text-gray-500 px-4 py-5 max-w-screen-xl mx-auto md:px-8">
      <div className="max-w-lg sm:mx-auto sm:text-center">
        <img src="/arMage.png" className="w-14 sm:mx-auto" />
        <p className="leading-relaxed mt-2 text-[15px]">
          Arweave community hackathon 2023 powered by{' '}
          <a href="https://ar.io/" className="text-blue-500 underline">
            Arweave
          </a>
        </p>
      </div>
      <ul className="items-center justify-center mt-8 space-y-5 sm:flex sm:space-x-4 sm:space-y-0">
        {footerNavs.map((item, idx) => (
          <li className=" hover:text-gray-800">
            <a key={idx} href={item.href}>
              {item.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-8 items-center justify-between sm:flex">
        <div className="mt-4 sm:mt-0">&copy; 2023 ArMage All rights allowed 😉.</div>
        <div className="mt-6 sm:mt-0">
          <ul className="flex items-center space-x-4">
            <li className="border rounded-full flex items-center justify-center">
              <SocialIcon url="https://github.com/peteruche21/arMage" style={{ width: 35, height: 35 }} />
            </li>

            <li className="border rounded-full flex items-center justify-center">
              <SocialIcon url="https://twitter.com/peteranyaogu" style={{ width: 35, height: 35 }} />
            </li>

            <li className="border rounded-full flex items-center justify-center">
              <SocialIcon url="https://discordapp.com/users/700327336507080734" style={{ width: 35, height: 35 }} />
            </li>

            <li className="border rounded-full flex items-center justify-center">
              <SocialIcon url="https://www.linkedin.com/in/anyaogu" style={{ width: 35, height: 35 }} />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
