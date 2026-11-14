import { MaterialId, MaterialInfo } from '../types/game';
import woodImg from '../assets/images/rod_wood_card_1794638450707.jpg';
import plasticImg from '../assets/images/rod_plastic_card_1794638451968.jpg';
import ironImg from '../assets/images/rod_iron_card_1794638452305.jpg';
import glassImg from '../assets/images/rod_glass_card_1794638452168.jpg';
import rubberImg from '../assets/images/rod_rubber_card_1794638453230.jpg';

export const MATERIALS: Record<MaterialId, MaterialInfo> = {
  wood: {
    id: 'wood',
    name: '나무 막대',
    shortLabel: '나무',
    image: woodImg,
    accentHex: '#9A5B25',
    softBgClass: 'bg-amber-50',
    borderClass: 'border-amber-300',
    textClass: 'text-amber-900',
    properties: [
      '물에 잘 뜨는 성질이 있어요.',
      '단단한 편이고 손으로 쉽게 구부러지지 않아요.',
      '자연의 나무에서 얻을 수 있는 재료예요.',
    ],
    scienceTip:
      '나무는 물보다 가벼운 성질이 있어서 물에 잘 뜨며, 따뜻하고 튼튼해서 가구나 배를 만들 때 자주 쓰여요.',
    compareNote: '물에는 잘 뜨지만 오랫동안 물에 젖을 수 있고, 고무처럼 쭉 구부러지지는 않아요.',
  },
  plastic: {
    id: 'plastic',
    name: '플라스틱 막대',
    shortLabel: '플라스틱',
    image: plasticImg,
    accentHex: '#0284C7',
    softBgClass: 'bg-sky-50',
    borderClass: 'border-sky-300',
    textClass: 'text-sky-900',
    properties: [
      '아주 가벼워서 들고 다니기 편해요.',
      '물에 잘 젖지 않고 대부분 물에 잘 떠요.',
      '종류와 두께에 따라 조금 구부러지는 것도 있어요.',
    ],
    scienceTip:
      '플라스틱은 가볍고 물에 젖지 않으며 다양한 색과 모양으로 만들 수 있어 컵, 자, 장난감에 널리 쓰여요.',
    compareNote: '가볍고 물에 강하지만, 자석에 붙지 않고 철만큼 무거운 힘을 버티지는 못해요.',
  },
  iron: {
    id: 'iron',
    name: '철 막대',
    shortLabel: '철',
    image: ironImg,
    accentHex: '#475569',
    softBgClass: 'bg-slate-100',
    borderClass: 'border-slate-300',
    textClass: 'text-slate-900',
    properties: [
      '매우 단단하고 튼튼해서 쉽게 부러지지 않아요.',
      '자석에 찰싹 달라붙는 성질이 있어요.',
      '무거운 편이며, 손으로 쉽게 구부러지지 않아요.',
    ],
    scienceTip:
      '철은 여러 물질 가운데 특히 단단하고 튼튼하며 자석에 붙는 특별한 성질이 있어요. 다리나 튼튼한 도구를 만들 때 쓰여요.',
    compareNote: '무겁고 단단해서 물에 가라앉고, 투명하거나 고무처럼 잘 구부러지지 않아요.',
  },
  glass: {
    id: 'glass',
    name: '유리 막대',
    shortLabel: '유리',
    image: glassImg,
    accentHex: '#0D9488',
    softBgClass: 'bg-teal-50',
    borderClass: 'border-teal-300',
    textClass: 'text-teal-900',
    properties: [
      '반대편이 훤히 보일 만큼 투명해요.',
      '표면이 매끈하고 단단하지만 충격을 받으면 깨지기 쉬워요.',
      '물에 뜨지 않고 아래로 가라앉아요.',
    ],
    scienceTip:
      '유리는 빛이 잘 통과해 투명하게 비치는 성질이 있어요. 과학 실험용 막대나 창문, 어항을 만들 때 아주 유용하답니다.',
    compareNote: '단단해 보이지만 떨어뜨리거나 세게 부딪히면 깨지기 쉽고, 구부릴 수 없어요.',
  },
  rubber: {
    id: 'rubber',
    name: '고무 막대',
    shortLabel: '고무',
    image: rubberImg,
    accentHex: '#D97706',
    softBgClass: 'bg-orange-50',
    borderClass: 'border-orange-300',
    textClass: 'text-orange-900',
    properties: [
      '손으로 쉽게 구부러지고 잘 늘어나요.',
      '구부렸다가 놓으면 원래 모양으로 돌아오는 성질(탄성)이 있어요.',
      '부드럽고 미끄럼을 잘 막아 줘요.',
    ],
    scienceTip:
      '고무는 힘을 주면 잘 휘어지거나 늘어나고, 힘을 빼면 다시 원래 모양으로 돌아오는 탄성이 뛰어난 물질이에요.',
    compareNote: '잘 구부러지지만 유리처럼 투명하지 않고, 자석에 붙지도 않아요.',
  },
};

export const MATERIAL_LIST: MaterialInfo[] = [
  MATERIALS.wood,
  MATERIALS.plastic,
  MATERIALS.iron,
  MATERIALS.glass,
  MATERIALS.rubber,
];
