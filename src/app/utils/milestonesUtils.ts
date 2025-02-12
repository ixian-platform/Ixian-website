interface Milestone {
  title: string;
  description: string;
}

export interface MilestonesData {
  index: number;
  year: string;
  milestones: Milestone[];
}

export const milestonesData: MilestonesData[] = [
  {
    index: 0,
    year: '2016',
    milestones: [
      {
        title: 'Idea & Concept Development',
        description:
          'Identified the need for a decentralized and secure chat application but found no existing platform capable of meeting the requirements. Initiated the search for a scalable, secure, and efficient solution.',
      },
      {
        title: 'Research',
        description:
          'Explored peer-to-peer systems, distributed ledger technology, scalable networking solutions, and innovative consensus mechanisms to establish a strong technical foundation.',
      },
      {
        title: 'Project Planning',
        description:
          'Defined the initial project roadmap, outlining key milestones, technical challenges, and long-term objectives to guide development.',
      },
    ],
  },
  {
    index: 1,
    year: '2017',
    milestones: [
      {
        title: 'White Paper & Overview Paper',
        description:
          'Authored and published the preliminary version of the Ixian White Paper and Overview Paper, detailing the technology, vision, and unique approach to secure and scalable communication.',
      },
      {
        title: 'Prototype Development',
        description:
          'Developed the first working prototype, testing core concepts such as decentralized networking, security mechanisms, and the initial Proof-of-Stake based Ixian consensus model.',
      },
      {
        title: 'Project Launch',
        description:
          'Officially introduced the Ixian project, engaging the community, developers, and early adopters to refine and expand the vision.',
      },
    ],
  },
  {
    index: 2,
    year: '2018',
    milestones: [
      {
        title: 'Alpha & Beta Development',
        description:
          'Advanced development of Ixian’s core components and released an early-stage SDK. Ixian S2 and Spixi entered the alpha stage, while Ixian DLT progressed through beta development, refining consensus, and scalability mechanisms.',
      },
      {
        title: 'DLT & S2 Beta Testnet Release',
        description:
          'Launched the Ixian DLT and S2 beta testnet, enabling real-world testing of the decentralized infrastructure, network stability, and performance optimizations.',
      },
      {
        title: 'DLT Mainnet Release ',
        description:
          'Released the Ixian DLT mainnet, establishing a fully operational decentralized ledger to support secure transactions and future ecosystem expansion.',
      },
    ],
  },
  {
    index: 3,
    year: '2019',
    milestones: [
      {
        title: 'DLT Spixi Support',
        description:
          'Developed the functionality for Ixian DLT that was necessary to support Spixi operation, enabling secure, decentralized messaging and transactions powered by the Ixian blockchain.',
      },
      {
        title: 'Documentation with SDK',
        description:
          'Published early-stage documentation and improved the SDK, providing developers with the tools needed to build on and integrate with the Ixian ecosystem.',
      },
      {
        title: 'S2 & Spixi Beta Mainnet release',
        description:
          'Deployed mainnet versions of Ixian S2 and Spixi beta, allowing real-world testing and further refinement of decentralized communication and networking features.',
      },
    ],
  },
  {
    index: 4,
    year: '2020',
    milestones: [
      {
        title: 'DLT Upgrades',
        description:
          'Introduced key enhancements to Ixian DLT, including lightweight transaction verification for clients, chain reorganization support, and basic peer blacklisting to improve network security. Upgraded the base network protocol and INVs for greater efficiency and optimized data propagation.',
      },
      {
        title: 'Spixi Improvements',
        description:
          'Expanded Spixi’s functionality with push notifications, avatars, and VoIP support. Enhanced user experience with localization, message reactions, message deletion, tipping, and "is typing" indicators. Introduced bot-related features to enable moderated group chats.',
      },
      {
        title: 'Platform Monitoring, Research & Optimizations',
        description:
          'Conducted extensive testing and monitoring of network performance and the consensus mechanism. Researched scalability solutions and optimizations to enhance the efficiency and resilience of the Ixian ecosystem.',
      },
    ],
  },
  {
    index: 5,
    year: '2021',
    milestones: [
      {
        title: 'DLT Upgrades',
        description:
          'Began work on Ixiac Omega our Proof-of-Collaborative-Work consensus mechanism. Improved the stability of the network. Optimized DLT storage for better performance. Adjusted tokenomics, aligning it with community feedback and Ixian’s original vision.',
      },
      {
        title: 'Platform Upgrades',
        description:
          'Upgraded the entire Ixian ecosystem including DLT, S2, Spixi, and SDK, to enhance interoperability, security, and scalability.  Introduced IxiOfflineTools for advanced usability. Released IxiWatt GUI Miner to make mining easier for everyone.',
      },
      {
        title: 'Spixi Security Updates',
        description:
          'Strengthened Spixi’s security with enhanced encryption, biometric authentication, and other critical updates. Improved the user experience to ensure secure communication.',
      },
    ],
  },
  {
    index: 6,
    year: '2022',
    milestones: [
      {
        title: 'Release of Ixiac Omega - PoCW',
        description:
          'Conducted testing and pre-release of Ixiac Omega, refining the PoCW consensus mechanism for enhanced decentralization and efficiency. Successfully launched the initial mainnet version, optimizing security, scalability, and network performance.',
      },
      {
        title: 'Platform Upgrades',
        description:
          'Upgraded the core cryptographic foundation from SHA-2 to SHA-3, enhancing security and setting a precedence for such upgrades in the future. Upgraded the block explorer for better transparency and optimized Ixian S2 and DLT for improved performance and stability.',
      },
      {
        title: 'Spixi MAUI Development and UX Overhaul',
        description:
          'Began transitioning Spixi to .NET MAUI, modernizing its architecture for cross-platform compatibility, improved performance, and a better user experience.',
      },
    ],
  },
  {
    index: 7,
    year: '2023',
    milestones: [
      {
        title: 'Ixian Upgrade Proposals - IXIUP ',
        description:
          'Introduced IXIUP - several upgrade proposals for implementing network upgrades based on testing and evolving requirements. Upgrade proposals were IXI Names, UTXO Upgrades, Data Structures/Merkle Tree Upgrades, Presence List Scaling, Dynamic Fees, and Storage Improvements.',
      },
      {
        title: 'IXI Names Research & Development',
        description:
          'Began R&D of IXI Names, a decentralized identity system allowing users to register human-readable names on the Ixian network simplifying transactions and interactions for users.',
      },
      {
        title: 'Modernizing the Codebase',
        description:
          'Updated the Ixian codebase to improve maintainability, performance, and scalability. Upgraded to .NET 6 as part of the transition to a more modern and efficient development framework.',
      },
    ],
  },
  {
    index: 8,
    year: '2024',
    milestones: [
      {
        title: 'Platform Upgrades',
        description:
          'Implemented Ixiac Omega improvements based on two years of mainnet data, refining consensus efficiency and stability. Introduced protocol updates and enhancements to ensure network liveness under all conditions, further strengthening the resilience of the Ixian Platform.',
      },
      {
        title: 'Spixi MAUI Release and UX Overhaul',
        description:
          'Launched the new Spixi built on .NET MAUI, delivering a modern, cross-platform experience with improved performance, security, and usability. Enhanced notifications for better reliability and user engagement.',
      },
      {
        title: 'IXI Labs Development Company',
        description:
          'Established IXI Labs, a development company focused on building and delivering innovative solutions powered by Ixian technology.',
      },
    ],
  },
  {
    index: 9,
    year: 'Upcoming Releases',
    milestones: [
      {
        title: 'Paving the Way to Ixian Firefly Release',
        description:
          'Ixian DLT v1.0, the Firefly Release, marks a major milestone in the evolution of the platform. To reach this goal, we are incrementally rolling out new versions of Ixian DLT, each introducing key features and optimizations. Through continuous upgrades, testing, and refinements, we are shaping a feature-complete, scalable, and resilient network.',
      },
      {
        title: 'IXI Names Portal Release',
        description:
          'Launching a dedicated portal for managing IXI Names, providing a user-friendly interface for registration, management, and integration of  human-readable names on the Ixian Platform.',
      },
      {
        title: 'Spixi Mini Apps',
        description:
          'Introducing Spixi Mini Apps, enabling developers to build and deploy lightweight, decentralized applications within the Spixi ecosystem.',
      },
    ],
  },
];
