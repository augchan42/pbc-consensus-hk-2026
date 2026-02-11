/**
 * Line commentary data consolidated from sixlines-ios LineData.
 * Registers indicate the traditional assessment of each line position.
 * Notes provide classical phrases and interpretive commentary.
 * Source: sixlines-ios/Packages/SixLinesCore/Sources/SixLinesCore/LineData/
 */

export type LineRegister = "blameless" | "auspicious" | "inauspicious" | "danger" | "regret" | "distress" | "blame";

export interface LineNote {
  phrase?: string;
  note?: string;
  isFamous?: boolean;
}

export interface LineInfo {
  register: LineRegister;
  phrase?: string;
  note?: string;
  isFamous?: boolean;
}

const REGISTERS: Record<number, Record<number, LineRegister>> = {
  1: { 1: "blameless", 2: "blameless", 3: "danger", 4: "blameless", 5: "blameless", 6: "regret" },
  2: { 1: "blameless", 2: "blameless", 3: "blameless", 4: "blameless", 5: "auspicious", 6: "blameless" },
  3: { 1: "blameless", 2: "blameless", 3: "distress", 4: "auspicious", 5: "inauspicious", 6: "blameless" },
  4: { 1: "distress", 2: "auspicious", 3: "blameless", 4: "distress", 5: "auspicious", 6: "blameless" },
  5: { 1: "blameless", 2: "auspicious", 3: "blameless", 4: "blameless", 5: "auspicious", 6: "auspicious" },
  6: { 1: "auspicious", 2: "blameless", 3: "danger", 4: "auspicious", 5: "auspicious", 6: "blameless" },
  7: { 1: "inauspicious", 2: "blameless", 3: "inauspicious", 4: "blameless", 5: "inauspicious", 6: "blameless" },
  8: { 1: "blameless", 2: "auspicious", 3: "blameless", 4: "auspicious", 5: "auspicious", 6: "inauspicious" },
  9: { 1: "blame", 2: "auspicious", 3: "blameless", 4: "blameless", 5: "blameless", 6: "inauspicious" },
  10: { 1: "blameless", 2: "auspicious", 3: "inauspicious", 4: "auspicious", 5: "danger", 6: "auspicious" },
  11: { 1: "auspicious", 2: "blameless", 3: "blameless", 4: "blameless", 5: "auspicious", 6: "distress" },
  12: { 1: "auspicious", 2: "auspicious", 3: "blameless", 4: "blameless", 5: "auspicious", 6: "blameless" },
  13: { 1: "blameless", 2: "distress", 3: "blameless", 4: "auspicious", 5: "blameless", 6: "blameless" },
  14: { 1: "blameless", 2: "blameless", 3: "blameless", 4: "blameless", 5: "auspicious", 6: "auspicious" },
  15: { 1: "auspicious", 2: "auspicious", 3: "auspicious", 4: "blameless", 5: "blameless", 6: "blameless" },
  16: { 1: "inauspicious", 2: "auspicious", 3: "regret", 4: "blameless", 5: "blameless", 6: "blameless" },
  17: { 1: "auspicious", 2: "blameless", 3: "blameless", 4: "inauspicious", 5: "auspicious", 6: "blameless" },
  18: { 1: "danger", 2: "blameless", 3: "blame", 4: "distress", 5: "blameless", 6: "blameless" },
  19: { 1: "auspicious", 2: "auspicious", 3: "blameless", 4: "blameless", 5: "auspicious", 6: "blameless" },
  20: { 1: "distress", 2: "blameless", 3: "blameless", 4: "blameless", 5: "blameless", 6: "blameless" },
  21: { 1: "blameless", 2: "blameless", 3: "distress", 4: "auspicious", 5: "danger", 6: "inauspicious" },
  22: { 1: "blameless", 2: "blameless", 3: "auspicious", 4: "blameless", 5: "distress", 6: "blameless" },
  23: { 1: "inauspicious", 2: "inauspicious", 3: "blameless", 4: "inauspicious", 5: "blameless", 6: "blameless" },
  24: { 1: "auspicious", 2: "auspicious", 3: "danger", 4: "blameless", 5: "blameless", 6: "inauspicious" },
  25: { 1: "auspicious", 2: "blameless", 3: "blameless", 4: "blameless", 5: "blameless", 6: "blameless" },
  26: { 1: "danger", 2: "blameless", 3: "blameless", 4: "auspicious", 5: "auspicious", 6: "blameless" },
  27: { 1: "inauspicious", 2: "inauspicious", 3: "inauspicious", 4: "blameless", 5: "auspicious", 6: "danger" },
  28: { 1: "blameless", 2: "blameless", 3: "inauspicious", 4: "distress", 5: "blameless", 6: "inauspicious" },
  29: { 1: "inauspicious", 2: "blameless", 3: "blameless", 4: "blameless", 5: "blameless", 6: "inauspicious" },
  30: { 1: "blameless", 2: "auspicious", 3: "inauspicious", 4: "blameless", 5: "auspicious", 6: "blameless" },
  31: { 1: "blameless", 2: "inauspicious", 3: "distress", 4: "regret", 5: "blameless", 6: "blameless" },
  32: { 1: "inauspicious", 2: "regret", 3: "distress", 4: "blameless", 5: "inauspicious", 6: "inauspicious" },
  33: { 1: "danger", 2: "blameless", 3: "danger", 4: "auspicious", 5: "auspicious", 6: "blameless" },
  34: { 1: "inauspicious", 2: "auspicious", 3: "danger", 4: "regret", 5: "blameless", 6: "auspicious" },
  35: { 1: "blameless", 2: "auspicious", 3: "regret", 4: "danger", 5: "regret", 6: "danger" },
  36: { 1: "blameless", 2: "auspicious", 3: "blameless", 4: "blameless", 5: "blameless", 6: "blameless" },
  37: { 1: "regret", 2: "auspicious", 3: "danger", 4: "auspicious", 5: "auspicious", 6: "auspicious" },
  38: { 1: "regret", 2: "blameless", 3: "blameless", 4: "danger", 5: "blame", 6: "auspicious" },
  39: { 1: "blameless", 2: "blameless", 3: "blameless", 4: "blameless", 5: "blameless", 6: "auspicious" },
  40: { 1: "blameless", 2: "auspicious", 3: "distress", 4: "blameless", 5: "auspicious", 6: "blameless" },
  41: { 1: "blameless", 2: "inauspicious", 3: "blameless", 4: "blameless", 5: "auspicious", 6: "blameless" },
  42: { 1: "blameless", 2: "auspicious", 3: "inauspicious", 4: "blameless", 5: "auspicious", 6: "inauspicious" },
  43: { 1: "blame", 2: "blameless", 3: "inauspicious", 4: "regret", 5: "blameless", 6: "inauspicious" },
  44: { 1: "inauspicious", 2: "blameless", 3: "danger", 4: "inauspicious", 5: "blameless", 6: "distress" },
  45: { 1: "blameless", 2: "blameless", 3: "distress", 4: "blameless", 5: "regret", 6: "blameless" },
  46: { 1: "auspicious", 2: "blameless", 3: "blameless", 4: "blameless", 5: "auspicious", 6: "blameless" },
  47: { 1: "blameless", 2: "inauspicious", 3: "inauspicious", 4: "distress", 5: "blameless", 6: "regret" },
  48: { 1: "blameless", 2: "blameless", 3: "blameless", 4: "blameless", 5: "blameless", 6: "auspicious" },
  49: { 1: "blameless", 2: "blameless", 3: "inauspicious", 4: "regret", 5: "blameless", 6: "inauspicious" },
  50: { 1: "blameless", 2: "auspicious", 3: "regret", 4: "inauspicious", 5: "blameless", 6: "auspicious" },
  51: { 1: "auspicious", 2: "danger", 3: "blameless", 4: "blameless", 5: "danger", 6: "inauspicious" },
  52: { 1: "blameless", 2: "blameless", 3: "danger", 4: "blameless", 5: "regret", 6: "auspicious" },
  53: { 1: "danger", 2: "auspicious", 3: "inauspicious", 4: "blameless", 5: "auspicious", 6: "auspicious" },
  54: { 1: "auspicious", 2: "blameless", 3: "blameless", 4: "blameless", 5: "auspicious", 6: "blameless" },
  55: { 1: "blameless", 2: "auspicious", 3: "blameless", 4: "auspicious", 5: "auspicious", 6: "inauspicious" },
  56: { 1: "blameless", 2: "blameless", 3: "danger", 4: "blameless", 5: "blameless", 6: "inauspicious" },
  57: { 1: "blameless", 2: "blameless", 3: "distress", 4: "regret", 5: "regret", 6: "inauspicious" },
  58: { 1: "auspicious", 2: "regret", 3: "inauspicious", 4: "blameless", 5: "danger", 6: "blameless" },
  59: { 1: "auspicious", 2: "regret", 3: "blameless", 4: "auspicious", 5: "blameless", 6: "blameless" },
  60: { 1: "blameless", 2: "inauspicious", 3: "blameless", 4: "blameless", 5: "auspicious", 6: "inauspicious" },
  61: { 1: "auspicious", 2: "blameless", 3: "blameless", 4: "blameless", 5: "blameless", 6: "inauspicious" },
  62: { 1: "inauspicious", 2: "blameless", 3: "inauspicious", 4: "danger", 5: "blameless", 6: "inauspicious" },
  63: { 1: "blameless", 2: "blameless", 3: "blameless", 4: "blameless", 5: "blameless", 6: "danger" },
  64: { 1: "distress", 2: "auspicious", 3: "inauspicious", 4: "auspicious", 5: "auspicious", 6: "blameless" },
};

const LINE_NOTES: Record<number, Record<number, LineNote>> = {
  1: {
    1: { phrase: "潛龍勿用", note: "The dragon lies hidden—do not act. Your creative force is real but the time is not ripe. Like seeds underground in winter, the energy is present but must not yet manifest. Bide your time in calm strength; attempting to force what isn't ready wastes power you'll need later.", isFamous: true },
    5: { phrase: "飛龍在天", note: "Flying dragon in the heavens—it furthers one to see the great person. You have reached the sphere of full influence; your effect becomes visible throughout the world. This is the ruler's position, the '九五之尊' from which all Chinese emperors took their title. Everyone who encounters you may count themselves fortunate.", isFamous: true },
    6: { phrase: "亢龍有悔", note: "The dragon has flown too high and will have regret. When you climb so far that you lose touch with others, isolation leads inevitably to failure. There is nowhere to go but down. This line warns against titanic aspirations that exceed your power—a precipitous fall follows.", isFamous: true },
  },
  2: {
    1: { phrase: "履霜堅冰至", note: "When you feel frost underfoot, solid ice is not far off. The first hoarfrost of autumn signals winter's approach. Signs of decay, scarcely noticeable at first, multiply until dissolution comes. But precautions can be taken—heed the first signs and check them in time.", isFamous: true },
    2: { phrase: "直方大", note: "Straight, square, great—without special purpose, yet nothing remains unfurthered. The circle is heaven's symbol, the square is earth's. Nature creates all beings without erring: this is its squareness. It tolerates all creatures equally: this is its greatness. You achieve wisdom when all you do is as self-evident as what nature does.", isFamous: true },
    5: { phrase: "黃裳元吉", note: "A yellow lower garment brings supreme good fortune. Yellow is earth's color, the center—symbol of what is reliable and genuine. The undergarment is hidden beneath outer robes: true refinement doesn't advertise itself but expresses itself indirectly, as an effect from within.", isFamous: true },
    6: { phrase: "龍戰于野", note: "Dragons fight in the meadow; their blood is black and yellow. When the receptive force attempts to rule instead of serve, it draws down the anger of the creative. Both suffer injury. Black is heaven's color, yellow is earth's—when both bleed, the natural order has been violated.", isFamous: true },
  },
  4: {
    1: { phrase: "發蒙。利用刑人", note: "To make a fool develop, it furthers to apply discipline—but the fetters must be removed once the lesson takes hold. Youth takes everything carelessly at first; it must be shown life's seriousness. But discipline should not become drill. Continuous punishment humiliates and cripples; once understanding arrives, release the chains.", isFamous: true },
    5: { phrase: "童蒙吉", note: "Childlike folly brings good fortune. You seek instruction with an unassuming heart, devoid of arrogance, subordinating yourself to the teacher. This is the right path—genuine curiosity, willingness to not-know, positions you to be helped. The wise teacher recognizes such a student.", isFamous: true },
  },
  11: {
    3: { phrase: "无平不陂。无往不復", note: "No level plain without slopes, no going without return. Even in flourishing times, remember that change is constant. Hardship with perseverance brings no blame—don't worry about sincerity; blessing remains.", isFamous: true },
    5: { phrase: "帝乙歸妹。以祉元吉", note: "The sovereign gives his daughter in marriage—supreme good fortune. Power gracefully marries down. Though higher in rank, she obeys as all wives do. A truly modest union of high and low.", isFamous: true },
    6: { phrase: "城復于隍", note: "The city wall falls into the moat. Don't use armies now—give orders from your own city. Peace has ended; the structure collapses. Defense, not expansion.", isFamous: true },
  },
  12: {
    5: { phrase: "休否。其亡其亡。繫于苞桑", note: "Standstill ends. The great person brings good fortune. 'What if it fails? What if it fails?' Tie it to a clump of mulberry shoots—the root holds even when all seems to collapse.", isFamous: true },
    6: { phrase: "傾否。先否後喜", note: "Standstill overturns. First standstill, then joy. The obstruction finally breaks; what was blocked now flows again.", isFamous: true },
  },
  15: {
    1: { phrase: "謙謙君子", note: "Modest and still more modest—humility doubled. This lets you attempt what arrogance cannot. Cross the great water; the passage is auspicious.", isFamous: true },
    3: { phrase: "勞謙君子。有終吉", note: "The person of character with merit yet modest—carries things through to good fortune. This is the center of the hexagram, where its secret is disclosed. Achievement without self-inflation is the complete pattern.", isFamous: true },
  },
  22: {
    3: { phrase: "賁如濡如。永貞吉", note: "Graceful and moist—beauty maintained soft and living. Under the spell of grace and the mellow mood it brings. Do not sink into indolence but remain constant in perseverance." },
    6: { phrase: "白賁", note: "Simple white grace. At the highest stage, all ornament is discarded. Perfect grace consists not in exterior ornamentation but in the simple fitness of form—pure white needs nothing added.", isFamous: true },
  },
  23: {
    6: { phrase: "碩果不食", note: "A large fruit remains uneaten. When misfortune has spent itself, better times return. The seed of the good remains—it is just when the fruit falls to the ground that new growth sprouts from its seed. The wise person receives a carriage while the inferior person's house splits apart. Evil destroys itself; the good endures.", isFamous: true },
  },
  24: {
    1: { phrase: "不遠復", note: "Return from not far—no need for remorse, supreme good fortune. You haven't strayed far; the return is easy. Confucius praised his disciple Yan Hui for this: 'If he did anything wrong, he became aware of it; and when he knew it, he did not do the same thing again.' Catching error early enables the best outcome.", isFamous: true },
    6: { phrase: "迷復。凶", note: "Missing the return brings misfortune—misfortune from within and without. If armies march in this way, they suffer great defeat, disastrous for the ruler. For ten years it will not be possible to attack again. You missed the right time; blind obstinacy has brought judgment upon itself.", isFamous: true },
  },
  29: {
    1: { phrase: "習坎。入于坎窞", note: "Falling into a pit within the abyss—double danger. Growing used to what is dangerous, allowing it to become part of you. Familiarity with evil leads to losing the right way.", isFamous: true },
    3: { phrase: "來之坎坎", note: "Forward is abyss, backward is abyss. Pause. Wait. Every movement leads into danger. Escape is impossible right now—acting from frustration only bogs you deeper. Remain until a way shows itself.", isFamous: true },
    5: { phrase: "坎不盈", note: "The abyss fills to the rim but not beyond. The way out is the line of least resistance—water doesn't rise higher than necessary. Great labors cannot happen now; just get out of the danger.", isFamous: true },
    6: { phrase: "三歲不得", note: "Bound and imprisoned, thorns on every side. For three years, lost. Entangled completely in wrong turns, no prospect of escape. The path disappeared long ago.", isFamous: true },
  },
  30: {
    2: { phrase: "黃離。元吉", note: "Yellow light—supreme good fortune. Yellow is the color of measure and mean, the midday sun. This is the symbol of highest culture: consummate harmony that holds to the center.", isFamous: true },
    3: { phrase: "日昃之離", note: "The light of the setting sun. If you don't beat the earthen pot and sing, you'll only have the sighing of old age. Don't cling to what is fading; accept the transition or be left lamenting.", isFamous: true },
    5: { phrase: "出涕沱若。戚嗟若。吉", note: "Tears flow, sighing in grief—yet good fortune. The one who truly understands weeps. Mourning properly means you have grasped what matters. Through sorrow comes clarity.", isFamous: true },
  },
  31: {
    3: { phrase: "咸其股。執其隨", note: "Influence in the thighs—they follow wherever the heart desires, without pause. Acting on the spur of every caprice leads to humiliation. You should not run precipitately after everyone you wish to influence, nor yield immediately to every whim of those you serve. Learn to hold back; this restraint is the very basis of human freedom.", isFamous: true },
    6: { phrase: "咸其輔頰舌", note: "Influence in the jaws, cheeks, and tongue. All talk, nothing real behind it—the most superficial way to influence others. Such mere tongue-wagging produces necessarily insignificant results. Neither good nor bad fortune is mentioned; the line offers only irrelevance. Words without substance move no one.", isFamous: true },
  },
  32: {
    1: { phrase: "浚恆貞凶", note: "Seeking duration too hastily brings persistent misfortune. Nothing that would further. What endures can only be created gradually through long-continued work. As Lao-tse says: 'If we wish to compress something, we must first let it fully expand.' Demanding too much at once means achieving nothing in the end.", isFamous: true },
    3: { phrase: "不恆其德", note: "Not giving duration to your character meets with disgrace. Persistent humiliation follows. If you remain at the mercy of moods—hope or fear aroused by the outer world—you lose inner consistency. These humiliations come from unforeseen quarters, but they aren't random: they're logical consequences of your own volatility.", isFamous: true },
    4: { phrase: "田无禽", note: "No game in the field. You can't catch what isn't there. Stalking quarry in the wrong place, you may wait forever without finding any. Persistence in search is not enough—you must seek in the right way, in the right place. What is not sought correctly is not found.", isFamous: true },
  },
  36: {
    4: { phrase: "入于左腹。獲明夷之心", note: "Penetrating the left side of the belly—you get at the very heart of the darkness and discover secret thoughts. There is no hope of improvement. Leave the scene of disaster before the storm breaks." },
    5: { phrase: "箕子之明夷", note: "Darkening of the light as with Prince Jizi, who feigned insanity at the tyrant's court. He could not withdraw, so he concealed his true sentiments. For those who cannot leave their posts: invincible perseverance of spirit, redoubled caution.", isFamous: true },
    6: { phrase: "不明晦。初登于天。後入于地", note: "Not light but darkness. First climbing to heaven, then plunging into earth's depths. The dark power reaches its climax—but evil must fall at the very moment it has wholly overcome good, consuming the energy to which it owed its duration.", isFamous: true },
  },
  40: {
    2: { phrase: "田獲三狐。得黃矢", note: "Three foxes killed in the field, a yellow arrow received. Persistence brings good fortune. The foxes are designing flatterers who must be removed before deliverance is complete. But use the right weapons—directness and the golden mean, symbolized by the yellow arrow. Craftiness defeated by sincerity, not by more craftiness.", isFamous: true },
    3: { phrase: "負且乘。致寇至", note: "Carrying a burden on your back while riding in a carriage—you encourage robbers to approach. Persistence leads to humiliation. Rising from need into comfort, you affect an ease that doesn't suit your true nature. This carelessness invites attack. The common person who pretends to be lordly invites theft; the arrogant attract enemies from all directions.", isFamous: true },
    6: { phrase: "公用射隼于高墉之上", note: "The prince shoots a hawk on a high wall. He kills it. Everything serves to further. A powerful inferior in an elevated position hinders deliverance, hardened in wickedness and resistant to inner influences. Forcible removal is required—first prepare the means within yourself, then bide your time, then act. Everything goes well.", isFamous: true },
  },
  47: {
    3: { phrase: "困于石。據于蒺蔾", note: "Oppressed by stone, leaning on thorns and thistles. Restless and indecisive in adversity, you butt against walls and lean on unstable things. If oppressed by what ought not to oppress, disgrace follows.", isFamous: true },
    5: { phrase: "劓刖。困于赤紱", note: "Nose and feet cut off—mutilated while wearing purple knee bands. Yet joy comes softly. One who has the good of mankind at heart is oppressed from above and below, finding no help. But little by little, things turn; stay firm in inner composure.", isFamous: true },
    6: { phrase: "困于葛藟", note: "Oppressed by creeping vines, moving uncertainly. You say 'movement brings remorse'—but if you feel remorse over this hesitation and make a start, good fortune comes. These bonds are easily broken; grasp the situation and decide.", isFamous: true },
  },
  48: {
    3: { phrase: "井渫不食。為我心惻", note: "The well is cleaned, but no one drinks from it. This is my heart's sorrow. An able person is available like purified water—but no use is made of them. The lament of unrecognized talent.", isFamous: true },
    5: { phrase: "井冽。寒泉食", note: "A clear, cold spring from which one can drink—the water of life. But good fortune is left out: the best water is only potential refreshment until actually drawn up. Wise words must be translated into life.", isFamous: true },
    6: { phrase: "井收勿幕。有孚元吉", note: "One draws from the well without hindrance. It is dependable. The inexhaustible spring—the more people draw from it, the greater its wealth becomes. A truly great person whose inner wealth never runs dry.", isFamous: true },
  },
  49: {
    3: { phrase: "革言三就。有孚", note: "Starting brings misfortune. Persistence brings danger. When talk of revolution has gone the rounds three times, one may commit oneself, and people will believe. Two mistakes to avoid: excessive haste and ruthlessness, or excessive hesitation and conservatism. Not every demand for change in the environment should be heeded—but when talk of change circles back for the third time, when the same complaint is repeated and well-founded, it should not fail of a hearing. Then you may commit yourself.", isFamous: true },
    5: { phrase: "大人虎變。未占有孚", note: "The great person changes like a tiger. Even before questioning the oracle, believed. A tiger's skin, with its highly visible black stripes on a yellow ground, shows its distinct pattern from afar—you can see what it is at a distance. It is the same with revolution brought about by a great person: large, clear guiding lines become visible, understandable to everyone. Therefore you don't need to first consult the oracle, for you win the spontaneous support of the people. The change is self-evident; the pattern speaks for itself.", isFamous: true },
    6: { phrase: "君子豹變。小人革面", note: "The superior person changes like a panther. The inferior person molts in the face. Starting brings misfortune. Remaining persistent brings good fortune. After the large problems are settled, certain minor reforms and elaborations remain necessary. The panther's spots are smaller and less distinct than the tiger's stripes—refinement of the original, bold pattern. The inferior person also 'molts'—conforming outwardly to the new order—but this molting doesn't go very deep. Be satisfied with the attainable. If you try to achieve too much, pushing for deeper transformation than is possible, unrest and misfortune will result.", isFamous: true },
  },
  50: {
    4: { phrase: "鼎折足。覆公餗", note: "The cauldron's legs broken, the prince's meal spilled, his person soiled. Weakness in high position with large plans and heavy responsibility—Confucius says this seldom escapes disaster.", isFamous: true },
    5: { phrase: "鼎黃耳金鉉", note: "Yellow handles, golden carrying rings—yellow is earth's color, the center; gold represents strong and able helpers. Modest leadership attracts those who complement and aid the work." },
    6: { phrase: "鼎玉鉉。大吉", note: "Jade rings combine hardness with soft luster. At the highest level, counsel works greatly to advantage because it is mild and pure. The work finds favor and becomes pleasing to all.", isFamous: true },
  },
  52: {
    3: { phrase: "艮其限。列其夤", note: "Keeping the hips still, making the sacrum stiff. Dangerous—the heart suffocates. This is enforced quiet: the restless heart subdued by forcible means. But fire smothered changes into acrid smoke. In meditation and concentration, don't try to force results. Calmness must develop naturally out of inner composure; artificial rigidity leads to unwholesome results.", isFamous: true },
    6: { phrase: "敦艮吉", note: "Noblehearted keeping still. Good fortune. This marks the consummation of the effort to attain tranquility. You are at rest not merely in small, circumscribed ways regarding matters of detail, but with a general resignation regarding life as a whole. This confers peace and good fortune in relation to every individual matter.", isFamous: true },
  },
  53: {
    4: { phrase: "鴻漸于木", note: "The wild goose gradually draws near the tree. Perhaps it will find a flat branch. No blame. A tree is not a suitable place for a wild goose. But if clever, it will find a flat branch on which it can get a footing. Life often brings you into inappropriate situations where it's difficult to hold your own. Being sensible and yielding enables you to discover a safe place, though surrounded by danger." },
    6: { phrase: "鴻漸于陸。其羽可用為儀", note: "The wild goose gradually draws near the cloud heights. Its feathers can be used for the sacred dance. Good fortune. Life comes to its end; work stands completed. The path rises high toward heaven, like wild geese leaving the earth far behind, keeping strict formation. If their feathers fall, they can serve as ornaments in sacred temple dances. The life of one who has perfected themselves becomes a bright light for the people of earth, who look up to them as an example.", isFamous: true },
  },
  54: {
    2: { phrase: "眇能視", note: "A one-eyed man who is able to see. The perseverance of a solitary one furthers. A girl married to a man who has disappointed her. Man and wife ought to work together like a pair of eyes—but here the girl is left behind in loneliness, the man of her choice unfaithful or dead. Yet she does not lose the inner light of loyalty. Though one eye is gone, she maintains her faithfulness even in solitude.", isFamous: true },
    6: { phrase: "女承筐无實。士刲羊无血", note: "The woman holds the basket, but there are no fruits in it. The man stabs the sheep, but no blood flows. Nothing that acts to further. The ritual is only superficially fulfilled—an empty basket, a sheep already dead, killed only to preserve forms. This impious, irreverent attitude bodes no good for a marriage. When ceremony becomes hollow, nothing real can grow.", isFamous: true },
  },
  57: {
    3: { phrase: "頻巽吝", note: "Repeated penetration. Humiliation. Penetrating reflection must not be pushed too far, lest it cripple the power of decision. After a matter has been thoroughly pondered, it is essential to form a decision and act. Repeated deliberation brings fresh doubts and scruples, and thereby humiliation—because one shows oneself unable to act.", isFamous: true },
    6: { phrase: "巽在牀下。喪其資斧", note: "Penetration under the bed. You lose your property and your ax. Persistence brings misfortune. Your understanding is sufficiently penetrating—you follow up injurious influences into the most secret corners. But you no longer have the strength to combat them decisively. Any attempt to penetrate further into the personal domain of darkness would only bring harm.", isFamous: true },
  },
  58: {
    1: { phrase: "和兌吉", note: "Contented joyousness. Good fortune. A quiet, wordless, self-contained joy, desiring nothing from without and resting content with everything, remains free of all egotistic likes and dislikes. In this freedom lies good fortune—the quiet security of a heart fortified within itself.", isFamous: true },
    3: { phrase: "來兌凶", note: "Coming joyousness. Misfortune. True joy must spring from within. But if you are empty within and wholly given over to the world, idle pleasures come streaming in from without. Those who lack inner stability and therefore need amusement will always find opportunity for indulgence. They attract external pleasures by the emptiness of their natures, and thus lose themselves more and more.", isFamous: true },
  },
  61: {
    2: { phrase: "鳴鶴在陰。其子和之", note: "A crane calling in the shade. Its young answers it. I have a good goblet; I will share it with you. The crane need not show itself on a high hill—it may be quite hidden when it sounds its call, yet its young will hear its note and give answer. Whenever a feeling is voiced with truth and frankness, a mysterious and far-reaching influence is exerted. The root of all influence lies in one's own inner being.", isFamous: true },
    6: { phrase: "翰音登于天", note: "Cockcrow penetrating to heaven. Persistence brings misfortune. The cock is dependable—it crows at dawn. But it cannot itself fly to heaven. It just crows. You may count on mere words to awaken faith. This may succeed now and then, but if persisted in, it will have bad consequences. Words without substance cannot reach the heights.", isFamous: true },
  },
  62: {
    1: { phrase: "飛鳥以凶", note: "The bird meets with misfortune through flying. A bird ought to remain in the nest until it is fledged. If it tries to fly before this, it invites misfortune. Extraordinary measures should be resorted to only when all else fails. At first, put up with traditional ways as long as possible; otherwise you exhaust yourself and still achieve nothing.", isFamous: true },
    6: { phrase: "弗遇過之。飛鳥離之", note: "Missing the meeting, exceeding. The flying bird leaves it behind. Misfortune. This is called calamity and disaster. You have flown too high—soaring ambition has carried you beyond what you can attain. A bird that flies too high eventually falls to disaster. The small cannot fulfill the demands of the great; time will pass you by.", isFamous: true },
  },
  63: {
    1: { phrase: "曳其輪。濡其尾", note: "You brake your wheels; you get your tail in the water—no blame. In times after completion, everything presses forward, but this pressing forward overshoots the mark. A person of strong character does not allow themselves to be infected by general intoxication but checks their course in time. Like a fox that at the last minute gets its tail wet, you may not remain untouched, but will suffer no real harm because your behavior was correct.", isFamous: true },
    5: { phrase: "東鄰殺牛", note: "The neighbor in the east who slaughters an ox does not attain as much real happiness as the neighbor in the west with his small offering. In times after completion, simple old forms give way to elaborate ritual and greater outward display. But inner seriousness is lacking; human caprice replaces obedience to the divine will. A simple sacrifice offered with real piety holds greater blessing than an impressive service without warmth.", isFamous: true },
    6: { phrase: "濡其首", note: "You get your head in the water. Danger. After crossing a stream, your head can only get wet if you turn back to look. As long as you go forward, you escape danger. But there is a fascination in standing still and looking back on a peril overcome. Such vain self-admiration brings misfortune; unless you resolve to go forward without pausing, you fall victim to this danger.", isFamous: true },
  },
  64: {
    1: { phrase: "濡其尾", note: "You get your tail in the water. Humiliating. In times of disorder there is a temptation to advance yourself rapidly to accomplish something tangible. But this enthusiasm leads only to failure and humiliation—the time for achievement has not yet arrived. The young fox, lacking the old fox's caution, plunges in boldly and may fall through. Spare yourself the opprobrium of failure by holding back.", isFamous: true },
    2: { phrase: "曳其輪", note: "You brake your wheels. Perseverance brings good fortune. The time to act has not yet come, but the patience needed is not idle waiting. Instead, develop in yourself the strength that will enable you to go forward. You must have a vehicle to effect the crossing—but for now, use the brakes. Patience in the highest sense means putting brakes on strength. Do not fall asleep and lose sight of the goal." },
    6: { phrase: "有孚于飲酒", note: "Drinking wine in genuine confidence—no blame. But if you wet your head, you lose it in truth. Before completion, at the dawning of the new time, friends gather in mutual trust, the time of waiting passed in conviviality. Since the new era is at the threshold, there is no blame in this. But keep within proper bounds. If in exuberance you get drunk, you forfeit the favorable situation through intemperance. Every end contains a new beginning; thus the Book of Changes gives hope.", isFamous: true },
  },
};

export function getLineInfo(hexagramNumber: number, linePosition: number): LineInfo | null {
  const regs = REGISTERS[hexagramNumber];
  if (!regs) return null;
  const register = regs[linePosition];
  if (!register) return null;
  const noteData = LINE_NOTES[hexagramNumber]?.[linePosition];
  return { register, ...noteData };
}
