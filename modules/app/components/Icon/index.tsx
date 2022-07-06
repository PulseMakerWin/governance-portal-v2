import logger from 'lib/logger';
import React from 'react';

const icons = {
  calendarcross: {
    path: (
      <g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          stroke="currentColor"
          d="M4.07168 0.416016C4.28827 0.416016 4.46386 0.591603 4.46386 0.808196V1.20038H6.81694V0.808196C6.81694 0.591603 6.99256 0.416016 7.20912 0.416016C7.42569 0.416016 7.60131 0.591603 7.60131 0.808196V1.20038H9.95439V0.808196C9.95439 0.591603 10.13 0.416016 10.3466 0.416016C10.5631 0.416016 10.7388 0.591603 10.7388 0.808196V1.20038H11.1309C12.6471 1.20038 13.8762 2.42947 13.8762 3.94564V11.0049C13.8762 12.5211 12.6471 13.7502 11.1309 13.7502H3.28732C1.77115 13.7502 0.542053 12.5211 0.542053 11.0049V3.94564C0.542053 2.42947 1.77115 1.20038 3.28732 1.20038H3.6795V0.808196C3.6795 0.591603 3.85509 0.416016 4.07168 0.416016ZM4.46386 1.98474H6.81694V2.37692C6.81694 2.59351 6.99256 2.7691 7.20912 2.7691C7.42569 2.7691 7.60131 2.59351 7.60131 2.37692V1.98474H9.95439V2.37692C9.95439 2.59351 10.13 2.7691 10.3466 2.7691C10.5631 2.7691 10.7388 2.59351 10.7388 2.37692V1.98474H11.1309C12.2139 1.98474 13.0918 2.86267 13.0918 3.94564V4.73H1.32641V3.94564C1.32641 2.86267 2.20434 1.98474 3.28732 1.98474H3.6795V2.37692C3.6795 2.59351 3.85509 2.7691 4.07168 2.7691C4.28827 2.7691 4.46386 2.59351 4.46386 2.37692V1.98474ZM1.32641 5.51436V11.0049C1.32641 12.0879 2.20434 12.9658 3.28732 12.9658H11.1309C12.2139 12.9658 13.0918 12.0879 13.0918 11.0049V5.51436H1.32641Z"
          strokeWidth="0.6"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          stroke="currentColor"
          d="M7.38653 9.16575L9.43087 7.12141C9.45371 7.0987 9.46764 7.06733 9.46764 7.0327C9.46764 6.96344 9.41155 6.90723 9.34216 6.90723C9.30766 6.90723 9.27629 6.92128 9.25345 6.94399L7.20911 8.98833L5.16478 6.94399C5.14206 6.92128 5.1107 6.90723 5.07607 6.90723C5.00668 6.90723 4.95059 6.96344 4.95059 7.0327C4.95059 7.06733 4.96452 7.0987 4.98736 7.12154L7.03169 9.16575L4.98736 11.2101C4.96452 11.2328 4.95059 11.2642 4.95059 11.2988C4.95059 11.3682 5.00668 11.4243 5.07607 11.4243C5.1107 11.4243 5.14206 11.4102 5.16478 11.3875L7.20911 9.34317L9.25345 11.3875C9.27629 11.4102 9.30766 11.4243 9.34216 11.4243C9.41155 11.4243 9.46764 11.3682 9.46764 11.2988C9.46764 11.2642 9.45371 11.2328 9.43087 11.2101L7.38653 9.16575Z"
        />
      </g>
    ),
    viewBox: '0 0 15 15'
  },
  calendar: {
    path: (
      <g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.07168 0.945312C4.28827 0.945312 4.46386 1.1209 4.46386 1.33749V1.72967H6.81694V1.33749C6.81694 1.1209 6.99256 0.945312 7.20912 0.945312C7.42569 0.945312 7.60131 1.1209 7.60131 1.33749V1.72967H9.95439V1.33749C9.95439 1.1209 10.13 0.945312 10.3466 0.945312C10.5631 0.945312 10.7388 1.1209 10.7388 1.33749V1.72967H11.1309C12.6471 1.72967 13.8762 2.95877 13.8762 4.47494V11.5342C13.8762 13.0504 12.6471 14.2795 11.1309 14.2795H3.28732C1.77115 14.2795 0.542053 13.0504 0.542053 11.5342V4.47494C0.542053 2.95877 1.77115 1.72967 3.28732 1.72967H3.6795V1.33749C3.6795 1.1209 3.85509 0.945312 4.07168 0.945312ZM4.46386 2.51404H6.81694V2.90622C6.81694 3.12281 6.99256 3.2984 7.20912 3.2984C7.42569 3.2984 7.60131 3.12281 7.60131 2.90622V2.51404H9.95439V2.90622C9.95439 3.12281 10.13 3.2984 10.3466 3.2984C10.5631 3.2984 10.7388 3.12281 10.7388 2.90622V2.51404H11.1309C12.2139 2.51404 13.0918 3.39196 13.0918 4.47494V5.2593H1.32641V4.47494C1.32641 3.39196 2.20434 2.51404 3.28732 2.51404H3.6795V2.90622C3.6795 3.12281 3.85509 3.2984 4.07168 3.2984C4.28827 3.2984 4.46386 3.12281 4.46386 2.90622V2.51404ZM1.32641 6.04366V11.5342C1.32641 12.6172 2.20434 13.4951 3.28732 13.4951H11.1309C12.2139 13.4951 13.0918 12.6172 13.0918 11.5342V6.04366H1.32641Z"
          strokeWidth="0.6"
        />
      </g>
    ),
    viewBox: '0 0 15 15'
  },
  vote: {
    path: (
      <g opacity="0.6">
        <path
          d="M8.822 1.75H1.76953V2.62482H8.822C8.93801 2.62482 9.04926 2.6709 9.13129 2.75293C9.21332 2.83496 9.25941 2.94622 9.25941 3.06222V9.51982H10.1342V3.06222C10.1342 2.7142 9.99597 2.38043 9.74988 2.13434C9.50379 1.88825 9.17002 1.75 8.822 1.75Z"
          fill="#7E7E88"
        />
        <path
          d="M10.5657 0H3.51465V0.874815H10.5657C10.6817 0.874815 10.7929 0.920899 10.875 1.00293C10.957 1.08496 11.0031 1.19622 11.0031 1.31222V7.76982H11.8779V1.31222C11.8779 0.9642 11.7396 0.630431 11.4935 0.384341C11.2475 0.138252 10.9137 0 10.5657 0V0Z"
          fill="#7E7E88"
        />
        <path
          d="M7.37615 3.64453H0.874815C0.6428 3.64453 0.420287 3.7367 0.256227 3.90076C0.0921678 4.06482 0 4.28733 0 4.51935L0 10.0598C0 10.2919 0.0921678 10.5144 0.256227 10.6784C0.420287 10.8425 0.6428 10.9347 0.874815 10.9347H7.37615C7.60817 10.9347 7.83068 10.8425 7.99474 10.6784C8.1588 10.5144 8.25097 10.2919 8.25097 10.0598V4.51935C8.25097 4.28733 8.1588 4.06482 7.99474 3.90076C7.83068 3.7367 7.60817 3.64453 7.37615 3.64453ZM4.1787 8.72283C3.96561 8.93474 3.67731 9.05369 3.37679 9.05369C3.07627 9.05369 2.78796 8.93474 2.57487 8.72283L1.61841 7.76929L2.23661 7.15108L3.19016 8.10463C3.23934 8.1536 3.30592 8.18109 3.37533 8.18109C3.44473 8.18109 3.51131 8.1536 3.5605 8.10463L6.0129 5.65223L6.6311 6.26898L4.1787 8.72283Z"
          fill="#7E7E88"
        />
      </g>
    ),
    viewBox: '0 0 12 11'
  },
  comment: {
    viewBox: '0 0 12 12',
    path: (
      <g>
        <path
          d="M8.95379 1.02542H3.59317C2.18598 1.02542 1.04688 2.1646 1.04688 3.57171V6.65407C1.04688 7.9674 2.05199 9.05295 3.32511 9.18697L3.35194 10.9828C3.35194 11.09 3.41897 11.1704 3.49937 11.2239C3.53956 11.2373 3.57976 11.2508 3.61996 11.2508C3.67352 11.2508 3.74055 11.2374 3.78075 11.1972L6.36725 9.20034H8.95375C10.3609 9.20034 11.5 8.06116 11.5 6.65404V3.57169C11.5 2.1645 10.361 1.02539 8.95375 1.02539L8.95379 1.02542ZM10.964 6.65407C10.964 7.7664 10.0661 8.66431 8.95379 8.66431H6.27348C6.21992 8.66431 6.15289 8.67767 6.11269 8.71787L3.88801 10.4333L3.86118 8.93232C3.86118 8.7849 3.74059 8.66431 3.59317 8.66431C2.48084 8.66431 1.58294 7.76641 1.58294 6.65408V3.57172C1.58294 2.45939 2.48084 1.56149 3.59317 1.56149H8.95379C10.0661 1.56149 10.964 2.45939 10.964 3.57172L10.964 6.65407Z"
          fill="#1AAB9B"
          stroke="#1AAB9B"
          strokeWidth="0.7"
        />
      </g>
    )
  },
  twitter: {
    viewBox: '0 0 15 12',
    path: (
      <g>
        <path
          d="M12.8055 2.25878C12.3463 2.46112 11.8535 2.59834 11.3358 2.65961C11.8644 2.34483 12.2691 1.84556 12.4609 1.25247C11.965 1.54397 11.4176 1.75563 10.8344 1.87038C10.3674 1.37497 9.70308 1.06641 8.96627 1.06641C7.55269 1.06641 6.40655 2.20607 6.40655 3.61088C6.40655 3.81011 6.42916 4.00471 6.47283 4.19079C4.34584 4.08456 2.45978 3.07128 1.19746 1.53156C0.976806 1.90681 0.851278 2.34404 0.851278 2.81078C0.851278 3.69383 1.3035 4.47299 1.98964 4.92884C1.57015 4.91489 1.17563 4.80015 0.830238 4.60942V4.64121C0.830238 5.8739 1.71285 6.90269 2.88315 7.13684C2.66874 7.19421 2.44263 7.226 2.20872 7.226C2.04344 7.226 1.8836 7.20972 1.72688 7.1787C2.05278 8.19045 2.99777 8.92618 4.11742 8.94635C3.24182 9.6286 2.13777 10.0341 0.93862 10.0341C0.732009 10.0341 0.528497 10.0217 0.328125 9.99918C1.46102 10.7225 2.80599 11.1443 4.25153 11.1443C8.96007 11.1443 11.5338 7.26632 11.5338 3.90317L11.5253 3.57368C12.0281 3.21702 12.4632 2.76892 12.8055 2.25878Z"
          fill="transparent"
          stroke="currentColor"
        />
      </g>
    )
  },
  forum: {
    viewBox: '0 0 18 14',
    path: (
      <g>
        <path
          d="M15.6255 11.1407L16.4414 12.1198V6.29821C16.4414 4.91892 15.3233 3.80078 13.944 3.80078H8.05969C7.23221 3.80078 6.56141 4.47159 6.56141 5.29907V8.46336C6.56141 9.84265 7.67954 10.9608 9.05883 10.9608H15.2414H15.4756L15.6255 11.1407Z"
          stroke="currentColor"
          fill="transparent"
        />
        <path
          d="M2.50631 7.83578H2.27123L2.12127 8.01681L1.31641 8.98842V3.17321C1.31641 1.79392 2.43454 0.675781 3.81383 0.675781H9.63353C10.461 0.675781 11.1318 1.34659 11.1318 2.17407V3.80426L8.33216 3.82378C7.35645 3.83058 6.56907 4.62347 6.56907 5.59921V7.83578H2.50631Z"
          stroke="currentColor"
          fill="transparent"
        />
      </g>
    )
  },
  communication: {
    viewBox: '0 0 16 16',
    path: (
      <g>
        <path
          d="M9.09654 11.6993L13.6944 11.7235L8.53043 5.64598C7.76915 5.64598 7.23496 6.13912 7.23165 6.76895L6.62067 6.76317L6.62066 6.76432L6.59788 9.17165L6.59787 9.17165L6.59786 9.17421C6.59056 10.5615 7.70925 11.692 9.09654 11.6993Z"
          stroke="#1AAB9B"
          strokeWidth="1.22202"
          fill="transparent"
        />
        <path
          d="M3.01533 8.06612L5.99933 8.08182L6.60717 8.08502L6.61352 7.4772L6.62248 6.62016L6.62251 6.62016L6.62251 6.61377C6.62251 6.12182 6.74903 5.73025 6.96608 5.47212C7.16853 5.23137 7.50896 5.03519 8.10707 5.03519L8.10868 5.03519L9.49319 5.03154L10.0994 5.02995L10.1026 4.42375L10.1091 3.18294C10.1142 2.21567 9.33421 1.4274 8.36693 1.42231L3.93731 1.399C2.55002 1.3917 1.4195 2.5104 1.4122 3.89768L1.3889 8.32388L1.37998 10.0193L2.46838 8.71935L3.01533 8.06612Z"
          stroke="#1AAB9B"
          strokeWidth="1.22202"
          fill="transparent"
        />
      </g>
    )
  },
  participation: {
    viewBox: '0 0 16 15',
    path: (
      <g>
        <path
          d="M14.9892 8.48323L13.3092 2.60323C13.2749 2.48292 13.165 2.40007 13.04 2.40007H12.5251L8.36859 1.01456C8.2435 0.972448 8.10568 1.02413 8.03869 1.13815L7.29639 2.40007H2.96C2.83504 2.40007 2.72512 2.48292 2.6908 2.60323L1.0108 8.48323C1.00791 8.4933 1.01107 8.50355 1.00935 8.51374C1.00663 8.52939 1 8.54363 1 8.56007V13.6001C1 13.7548 1.12537 13.8801 1.28 13.8801H14.72C14.8746 13.8801 15 13.7548 15 13.6001V8.56007C15 8.54363 14.9934 8.52939 14.9907 8.51374C14.9889 8.50355 14.9921 8.4933 14.9892 8.48323ZM8.40647 1.61749L12.0645 2.83674L10.3592 5.76007H5.96959L8.40647 1.61749ZM3.17123 2.96007H6.96697L5.31992 5.76007H4.36C4.20537 5.76007 4.08 5.8853 4.08 6.04007C4.08 6.19483 4.20537 6.32007 4.36 6.32007H5.48H10.52H11.64C11.7946 6.32007 11.92 6.19483 11.92 6.04007C11.92 5.8853 11.7946 5.76007 11.64 5.76007H11.0075L12.6408 2.96007H12.8288L14.3488 8.28007H1.65119L3.17123 2.96007ZM14.44 13.3201H1.56V8.84007H14.44V13.3201Z"
          fill="#1AAB9B"
          stroke="#1AAB9B"
          strokeWidth="0.6"
        />
      </g>
    )
  }
};

export default function Icon({
  name,
  size = 3,
  color = 'currentColor',
  role = 'presentation',
  focusable = false,
  sx,
  ...rest
}: {
  name: string;
  size?: number;
  color?: string;
  role?: string;
  focusable?: boolean;
  sx?: any;
}): React.ReactElement | null {
  if (!icons[name]) {
    logger.error(`Icon: No icon found with name ${name}`);
    return null;
  }

  return (
    <svg
      viewBox={icons[name].viewBox || '0 0 24 24'}
      sx={{ ...sx, size: size, verticalAlign: 'middle' }}
      color={color}
      display="inline-block"
      focusable={focusable}
      role={role}
      {...rest}
    >
      {icons[name].path}
    </svg>
  );
}
