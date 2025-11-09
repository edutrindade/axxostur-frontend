import React from "react";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";

// Ant Design Icons
import {
	AiOutlineDashboard,
	AiOutlineUser,
	AiOutlineTeam,
	AiOutlineBank,
	AiOutlineFileText,
	AiOutlineBarChart,
	AiOutlinePlus,
	AiOutlineLogout,
	AiOutlineSetting,
	AiOutlineHome,
	AiOutlineDollarCircle,
	AiOutlineCalendar,
	AiOutlineClockCircle,
	AiOutlineCheckCircle,
	AiOutlineExclamationCircle,
	AiOutlineWarning,
	AiOutlineMenu,
	AiOutlineClose,
	AiOutlineSearch,
	AiOutlineEdit,
	AiOutlineDelete,
	AiOutlineEye,
	AiOutlineEyeInvisible,
	AiOutlineMail,
	AiOutlinePhone,
	AiOutlineGlobal,
	AiOutlineDownload,
	AiOutlineUpload,
	AiOutlinePrinter,
	AiOutlineShareAlt,
	AiOutlineCopy,
	AiOutlineHeart,
	AiOutlineStar,
	AiOutlineFlag,
	AiOutlineTag,
	AiOutlineFilter,
	AiOutlineReload,
	AiOutlineSync,
	AiOutlineCloudUpload,
	AiOutlineCloudDownload,
	AiOutlineLock,
	AiOutlineUnlock,
	AiOutlineKey,
	AiOutlineNotification,
	AiOutlineBell,
	AiOutlineMessage,
	AiOutlineComment,
	AiOutlineQuestionCircle,
	AiOutlineInfoCircle,
	AiOutlineArrowUp,
	AiOutlineArrowDown,
	AiOutlineArrowLeft,
	AiOutlineArrowRight,
} from "react-icons/ai";

// Feather Icons
import {
	FiActivity,
	FiUsers,
	FiTrendingUp,
	FiPlus,
	FiLogOut,
	FiSettings,
	FiHome,
	FiDollarSign,
	FiCalendar,
	FiClock,
	FiCheck,
	FiAlertCircle,
	FiAlertTriangle,
	FiMenu,
	FiX,
	FiSearch,
	FiEdit,
	FiTrash2,
	FiEye,
	FiEyeOff,
	FiMail,
	FiPhone,
	FiGlobe,
	FiDownload,
	FiUpload,
	FiPrinter,
	FiShare2,
	FiCopy,
	FiHeart,
	FiStar,
	FiFlag,
	FiTag,
	FiFilter,
	FiArrowUp,
	FiArrowDown,
	FiArrowLeft,
	FiArrowRight,
	FiRefreshCw,
	FiRotateCw,
	FiUploadCloud,
	FiDownloadCloud,
	FiLock,
	FiUnlock,
	FiShield,
	FiKey,
	FiBell,
	FiMessageSquare,
	FiMessageCircle,
	FiHelpCircle,
	FiInfo,
	FiSun,
	FiMoon,
	FiMonitor,
	FiSmartphone,
	FiTablet,
	FiWifi,
	FiWifiOff,
	FiDatabase,
	FiServer,
	FiHardDrive,
	FiCpu,
	FiZap,
	FiTool,
	FiPackage,
	FiBox,
	FiArchive,
	FiFolder,
	FiFolderPlus,
	FiFileText,
	FiFilePlus,
	FiImage,
	FiVideo,
	FiMusic,
	FiHeadphones,
	FiMic,
	FiMicOff,
	FiCamera,
	FiCameraOff,
	FiMap,
	FiMapPin,
	FiNavigation,
	FiCompass,
	FiTarget,
	FiAward,
	FiGift,
	FiShoppingCart,
	FiShoppingBag,
	FiCreditCard,
	FiBarChart,
	FiBarChart2,
	FiPieChart,
	FiTrendingDown,
	FiMaximize,
	FiMinimize,
	FiMove,
	FiShuffle,
	FiRepeat,
	FiSkipBack,
	FiSkipForward,
	FiPlay,
	FiPause,
	FiVolume,
	FiVolumeX,
	FiMoreHorizontal,
	FiMoreVertical,
	FiChevronUp,
	FiChevronDown,
	FiChevronLeft,
	FiChevronRight,
} from "react-icons/fi";

// Font Awesome Icons
import {
	FaChartLine,
	FaUsers,
	FaBuilding,
	FaHandshake,
	FaChartBar,
	FaPlus,
	FaSignOutAlt,
	FaCog,
	FaHome,
	FaDollarSign,
	FaCalendarAlt,
	FaClock,
	FaCheckCircle,
	FaExclamationCircle,
	FaExclamationTriangle,
	FaBars,
	FaTimes,
	FaSearch,
	FaEdit,
	FaTrash,
	FaEye,
	FaEyeSlash,
	FaEnvelope,
	FaPhone,
	FaGlobe,
	FaDownload,
	FaUpload,
	FaPrint,
	FaShare,
	FaCopy,
	FaHeart,
	FaStar,
	FaFlag,
	FaTag,
	FaFilter,
	FaSort,
	FaRedo,
	FaSync,
	FaCloudUploadAlt,
	FaCloudDownloadAlt,
	FaLock,
	FaUnlock,
	FaKey,
	FaBell,
	FaComments,
	FaComment,
	FaQuestionCircle,
	FaInfoCircle,
	FaSun,
	FaMoon,
	FaDesktop,
	FaMobile,
	FaTabletAlt,
	FaWifi,
	FaDatabase,
	FaServer,
	FaHdd,
	FaMicrochip,
	FaBolt,
	FaTools,
	FaBox,
	FaArchive,
	FaFolder,
	FaFolderPlus,
	FaFileAlt,
	FaImage,
	FaVideo,
	FaMusic,
	FaHeadphones,
	FaMicrophone,
	FaMicrophoneSlash,
	FaCamera,
	FaMap,
	FaMapMarkerAlt,
	FaCompass,
	FaBullseye,
	FaAward,
	FaGift,
	FaShoppingCart,
	FaShoppingBag,
	FaCreditCard,
	FaChartPie,
	FaChartArea,
	FaArrowUp,
	FaArrowDown,
	FaArrowLeft,
	FaArrowRight,
	FaEllipsisH,
	FaEllipsisV,
	FaChevronUp,
	FaChevronDown,
	FaChevronLeft,
	FaChevronRight,
} from "react-icons/fa";

// Heroicons
import {
	HiOutlineViewGrid,
	HiOutlineUsers,
	HiOutlineOfficeBuilding,
	HiOutlineDocumentText,
	HiOutlineChartBar,
	HiOutlinePlus,
	HiOutlineLogout,
	HiOutlineCog,
	HiOutlineHome,
	HiOutlineCurrencyDollar,
	HiOutlineCalendar,
	HiOutlineClock,
	HiOutlineCheckCircle,
	HiOutlineExclamationCircle,
	HiOutlineExclamation,
	HiOutlineMenu,
	HiOutlineX,
	HiOutlineSearch,
	HiOutlinePencil,
	HiOutlineTrash,
	HiOutlineEye,
	HiOutlineEyeOff,
	HiOutlineMail,
	HiOutlinePhone,
	HiOutlineGlobe,
	HiOutlineDownload,
	HiOutlineUpload,
	HiOutlinePrinter,
	HiOutlineShare,
	HiOutlineClipboardCopy,
	HiOutlineHeart,
	HiOutlineStar,
	HiOutlineFlag,
	HiOutlineTag,
	HiOutlineFilter,
	HiOutlineSortAscending,
	HiOutlineRefresh,
	HiOutlineCloudUpload,
	HiOutlineCloudDownload,
	HiOutlineLockClosed,
	HiOutlineLockOpen,
	HiOutlineShieldCheck,
	HiOutlineKey,
	HiOutlineBell,
	HiOutlineChat,
	HiOutlineChatAlt,
	HiOutlineQuestionMarkCircle,
	HiOutlineInformationCircle,
	HiOutlineSun,
	HiOutlineMoon,
	HiOutlineDesktopComputer,
	HiOutlineDeviceMobile,
	HiOutlineDeviceTablet,
	HiOutlineWifi,
	HiOutlineDatabase,
	HiOutlineServer,
	HiOutlineFolder,
	HiOutlineFolderAdd,
	HiOutlineDocumentAdd,
	HiOutlinePhotograph,
	HiOutlineVideoCamera,
	HiOutlineMusicNote,
	HiOutlineMicrophone,
	HiOutlineCamera,
	HiOutlineMap,
	HiOutlineLocationMarker,
	HiOutlineGift,
	HiOutlineShoppingCart,
	HiOutlineShoppingBag,
	HiOutlineCreditCard,
	HiOutlineChartPie,
	HiOutlineTrendingUp,
	HiOutlineTrendingDown,
	HiOutlineArrowUp,
	HiOutlineArrowDown,
	HiOutlineArrowLeft,
	HiOutlineArrowRight,
	HiOutlineDotsHorizontal,
	HiOutlineDotsVertical,
	HiOutlineChevronUp,
	HiOutlineChevronDown,
	HiOutlineChevronLeft,
	HiOutlineChevronRight,
} from "react-icons/hi";

// Lucide Icons
import {
	LayoutDashboard,
	Users,
	Building,
	FileText,
	BarChart3,
	Plus,
	LogOut,
	Settings,
	Home,
	DollarSign,
	Calendar,
	Clock,
	CheckCircle,
	AlertCircle,
	AlertTriangle,
	TrendingUp,
	Activity,
	Handshake,
	Menu,
	X,
	Search,
	Edit,
	Trash2,
	Eye,
	EyeOff,
	Mail,
	Phone,
	Globe,
	Download,
	Upload,
	Printer,
	Share2,
	Copy,
	Heart,
	Star,
	Flag,
	Tag,
	Filter,
	ArrowUpDown,
	RefreshCw,
	CloudUpload,
	CloudDownload,
	Lock,
	Unlock,
	Shield,
	Key,
	Bell,
	MessageSquare,
	MessageCircle,
	HelpCircle,
	Info,
	Sun,
	Moon,
	Monitor,
	Smartphone,
	Tablet,
	Wifi,
	WifiOff,
	Database,
	Server,
	HardDrive,
	Cpu,
	Zap,
	Wrench,
	Package,
	Box,
	Archive,
	Folder,
	FolderPlus,
	FilePlus,
	Image,
	Video,
	Music,
	Headphones,
	Mic,
	MicOff,
	Camera,
	CameraOff,
	MapIcon,
	MapPin,
	Navigation,
	Compass,
	Target,
	Award,
	Gift,
	ShoppingCart,
	ShoppingBag,
	CreditCard,
	PieChart,
	TrendingDown,
	BarChart,
	LineChart,
	Maximize,
	Minimize,
	Move,
	RotateCw,
	Shuffle,
	Repeat,
	SkipBack,
	SkipForward,
	Play,
	Pause,
	Volume,
	VolumeX,
	ArrowUp,
	ArrowDown,
	ArrowLeft,
	ArrowRight,
	MoreHorizontal,
	MoreVertical,
	ChevronUp,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ExternalLink,
	Link,
	Unlink,
	Paperclip,
	Pin,
	Hash,
	AtSign,
	Percent,
	Type,
	Bold,
	Italic,
	Underline,
	AlignLeft,
	AlignCenter,
	AlignRight,
	Code,
	Terminal,
	Command,
	MousePointer,
	Crosshair,
	QrCode,
	Fingerprint,
	UserCheck,
	UserPlus,
	UserMinus,
	Crown,
	Gem,
	Coins,
	Wallet,
	Receipt,
	Calculator,
	Scale,
	Gauge,
	Timer,
	Hourglass,
	AlarmClock,
} from "lucide-react";

export type IconLibrary = "ant" | "feather" | "fa" | "heroicons" | "lucide";

export type IconName =
	| "dashboard"
	| "users"
	| "building"
	| "partners"
	| "reports"
	| "chart"
	| "plus"
	| "logout"
	| "settings"
	| "home"
	| "dollar"
	| "calendar"
	| "clock"
	| "check"
	| "alert"
	| "warning"
	| "trending"
	| "activity"
	| "handshake"
	| "file"
	| "menu"
	| "close"
	| "search"
	| "edit"
	| "delete"
	| "eye"
	| "eyeOff"
	| "mail"
	| "phone"
	| "globe"
	| "download"
	| "upload"
	| "print"
	| "share"
	| "copy"
	| "heart"
	| "star"
	| "flag"
	| "tag"
	| "filter"
	| "sort"
	| "refresh"
	| "sync"
	| "cloudUpload"
	| "cloudDownload"
	| "lock"
	| "unlock"
	| "shield"
	| "key"
	| "bell"
	| "message"
	| "comment"
	| "help"
	| "info"
	| "sun"
	| "moon"
	| "monitor"
	| "mobile"
	| "tablet"
	| "wifi"
	| "wifiOff"
	| "database"
	| "server"
	| "hardDrive"
	| "cpu"
	| "zap"
	| "tool"
	| "package"
	| "box"
	| "archive"
	| "folder"
	| "folderPlus"
	| "filePlus"
	| "image"
	| "video"
	| "music"
	| "headphones"
	| "mic"
	| "micOff"
	| "camera"
	| "cameraOff"
	| "map"
	| "mapPin"
	| "navigation"
	| "compass"
	| "target"
	| "award"
	| "gift"
	| "shoppingCart"
	| "shoppingBag"
	| "creditCard"
	| "pieChart"
	| "barChart"
	| "lineChart"
	| "trendingDown"
	| "maximize"
	| "minimize"
	| "move"
	| "rotate"
	| "shuffle"
	| "repeat"
	| "skipBack"
	| "skipForward"
	| "play"
	| "pause"
	| "stop"
	| "volume"
	| "volumeOff"
	| "arrowUp"
	| "arrowDown"
	| "arrowLeft"
	| "arrowRight"
	| "moreHorizontal"
	| "moreVertical"
	| "chevronUp"
	| "chevronDown"
	| "chevronLeft"
	| "chevronRight"
	| "externalLink"
	| "link"
	| "unlink"
	| "paperclip"
	| "pin"
	| "hash"
	| "atSign"
	| "percent"
	| "type"
	| "bold"
	| "italic"
	| "underline"
	| "alignLeft"
	| "alignCenter"
	| "alignRight"
	| "code"
	| "terminal"
	| "command"
	| "mousePointer"
	| "crosshair"
	| "qrCode"
	| "fingerprint"
	| "userCheck"
	| "userPlus"
	| "userMinus"
	| "crown"
	| "gem"
	| "coins"
	| "wallet"
	| "receipt"
	| "calculator"
	| "scale"
	| "gauge"
	| "timer"
	| "stopwatch"
	| "hourglass"
	| "alarmClock";

const iconMaps: Record<IconLibrary, Record<IconName, IconType>> = {
	ant: {
		dashboard: AiOutlineDashboard,
		users: AiOutlineUser,
		building: AiOutlineBank,
		partners: AiOutlineTeam,
		reports: AiOutlineBarChart,
		chart: AiOutlineBarChart,
		plus: AiOutlinePlus,
		logout: AiOutlineLogout,
		settings: AiOutlineSetting,
		home: AiOutlineHome,
		dollar: AiOutlineDollarCircle,
		calendar: AiOutlineCalendar,
		clock: AiOutlineClockCircle,
		check: AiOutlineCheckCircle,
		alert: AiOutlineExclamationCircle,
		warning: AiOutlineWarning,
		trending: AiOutlineBarChart,
		activity: AiOutlineBarChart,
		handshake: AiOutlineTeam,
		file: AiOutlineFileText,
		menu: AiOutlineMenu,
		close: AiOutlineClose,
		search: AiOutlineSearch,
		edit: AiOutlineEdit,
		delete: AiOutlineDelete,
		eye: AiOutlineEye,
		eyeOff: AiOutlineEyeInvisible,
		mail: AiOutlineMail,
		phone: AiOutlinePhone,
		globe: AiOutlineGlobal,
		download: AiOutlineDownload,
		upload: AiOutlineUpload,
		print: AiOutlinePrinter,
		share: AiOutlineShareAlt,
		copy: AiOutlineCopy,
		heart: AiOutlineHeart,
		star: AiOutlineStar,
		flag: AiOutlineFlag,
		tag: AiOutlineTag,
		filter: AiOutlineFilter,
		sort: AiOutlineReload,
		refresh: AiOutlineReload,
		sync: AiOutlineSync,
		cloudUpload: AiOutlineCloudUpload,
		cloudDownload: AiOutlineCloudDownload,
		lock: AiOutlineLock,
		unlock: AiOutlineUnlock,
		shield: AiOutlineNotification, // Fallback
		key: AiOutlineKey,
		bell: AiOutlineBell,
		message: AiOutlineMessage,
		comment: AiOutlineComment,
		help: AiOutlineQuestionCircle,
		info: AiOutlineInfoCircle,
		sun: AiOutlineNotification, // Fallback
		moon: AiOutlineNotification, // Fallback
		monitor: AiOutlineNotification, // Fallback
		mobile: AiOutlineNotification, // Fallback
		tablet: AiOutlineNotification, // Fallback
		wifi: AiOutlineNotification, // Fallback
		wifiOff: AiOutlineNotification, // Fallback
		database: AiOutlineNotification, // Fallback
		server: AiOutlineNotification, // Fallback
		hardDrive: AiOutlineNotification, // Fallback
		cpu: AiOutlineNotification, // Fallback
		zap: AiOutlineNotification, // Fallback
		tool: AiOutlineNotification, // Fallback
		package: AiOutlineNotification, // Fallback
		box: AiOutlineNotification, // Fallback
		archive: AiOutlineNotification, // Fallback
		folder: AiOutlineNotification, // Fallback
		folderPlus: AiOutlineNotification, // Fallback
		filePlus: AiOutlineNotification, // Fallback
		image: AiOutlineNotification, // Fallback
		video: AiOutlineNotification, // Fallback
		music: AiOutlineNotification, // Fallback
		headphones: AiOutlineNotification, // Fallback
		mic: AiOutlineNotification, // Fallback
		micOff: AiOutlineNotification, // Fallback
		camera: AiOutlineNotification, // Fallback
		cameraOff: AiOutlineNotification, // Fallback
		map: AiOutlineNotification, // Fallback
		mapPin: AiOutlineNotification, // Fallback
		navigation: AiOutlineNotification, // Fallback
		compass: AiOutlineNotification, // Fallback
		target: AiOutlineNotification, // Fallback
		award: AiOutlineNotification, // Fallback
		gift: AiOutlineNotification, // Fallback
		shoppingCart: AiOutlineNotification, // Fallback
		shoppingBag: AiOutlineNotification, // Fallback
		creditCard: AiOutlineNotification, // Fallback
		pieChart: AiOutlineBarChart,
		barChart: AiOutlineBarChart,
		lineChart: AiOutlineBarChart,
		trendingDown: AiOutlineBarChart,
		maximize: AiOutlineNotification, // Fallback
		minimize: AiOutlineNotification, // Fallback
		move: AiOutlineNotification, // Fallback
		rotate: AiOutlineReload,
		shuffle: AiOutlineNotification, // Fallback
		repeat: AiOutlineNotification, // Fallback
		skipBack: AiOutlineNotification, // Fallback
		skipForward: AiOutlineNotification, // Fallback
		play: AiOutlineNotification, // Fallback
		pause: AiOutlineNotification, // Fallback
		stop: AiOutlineNotification, // Fallback
		volume: AiOutlineNotification, // Fallback
		volumeOff: AiOutlineNotification, // Fallback
		arrowUp: AiOutlineArrowUp,
		arrowDown: AiOutlineArrowDown,
		arrowLeft: AiOutlineArrowLeft,
		arrowRight: AiOutlineArrowRight,
		moreHorizontal: AiOutlineNotification, // Fallback
		moreVertical: AiOutlineNotification, // Fallback
		chevronUp: AiOutlineNotification, // Fallback
		chevronDown: AiOutlineNotification, // Fallback
		chevronLeft: AiOutlineNotification, // Fallback
		chevronRight: AiOutlineNotification, // Fallback
		externalLink: AiOutlineNotification, // Fallback
		link: AiOutlineNotification, // Fallback
		unlink: AiOutlineNotification, // Fallback
		paperclip: AiOutlineNotification, // Fallback
		pin: AiOutlineNotification, // Fallback
		hash: AiOutlineNotification, // Fallback
		atSign: AiOutlineNotification, // Fallback
		percent: AiOutlineNotification, // Fallback
		type: AiOutlineNotification, // Fallback
		bold: AiOutlineNotification, // Fallback
		italic: AiOutlineNotification, // Fallback
		underline: AiOutlineNotification, // Fallback
		alignLeft: AiOutlineNotification, // Fallback
		alignCenter: AiOutlineNotification, // Fallback
		alignRight: AiOutlineNotification, // Fallback
		code: AiOutlineNotification, // Fallback
		terminal: AiOutlineNotification, // Fallback
		command: AiOutlineNotification, // Fallback
		mousePointer: AiOutlineNotification, // Fallback
		crosshair: AiOutlineNotification, // Fallback
		qrCode: AiOutlineNotification, // Fallback
		fingerprint: AiOutlineNotification, // Fallback
		userCheck: AiOutlineUser,
		userPlus: AiOutlineUser,
		userMinus: AiOutlineUser,
		crown: AiOutlineNotification, // Fallback
		gem: AiOutlineNotification, // Fallback
		coins: AiOutlineDollarCircle,
		wallet: AiOutlineDollarCircle,
		receipt: AiOutlineFileText,
		calculator: AiOutlineNotification, // Fallback
		scale: AiOutlineNotification, // Fallback
		gauge: AiOutlineNotification, // Fallback
		timer: AiOutlineClockCircle,
		stopwatch: AiOutlineClockCircle,
		hourglass: AiOutlineClockCircle,
		alarmClock: AiOutlineClockCircle,
	},
	feather: {
		dashboard: FiActivity,
		users: FiUsers,
		building: FiHome,
		partners: FiUsers,
		reports: FiTrendingUp,
		chart: FiTrendingUp,
		plus: FiPlus,
		logout: FiLogOut,
		settings: FiSettings,
		home: FiHome,
		dollar: FiDollarSign,
		calendar: FiCalendar,
		clock: FiClock,
		check: FiCheck,
		alert: FiAlertCircle,
		warning: FiAlertTriangle,
		trending: FiTrendingUp,
		activity: FiActivity,
		handshake: FiUsers,
		file: FiFileText,
		menu: FiMenu,
		close: FiX,
		search: FiSearch,
		edit: FiEdit,
		delete: FiTrash2,
		eye: FiEye,
		eyeOff: FiEyeOff,
		mail: FiMail,
		phone: FiPhone,
		globe: FiGlobe,
		download: FiDownload,
		upload: FiUpload,
		print: FiPrinter,
		share: FiShare2,
		copy: FiCopy,
		heart: FiHeart,
		star: FiStar,
		flag: FiFlag,
		tag: FiTag,
		filter: FiFilter,
		sort: FiArrowUp,
		refresh: FiRefreshCw,
		sync: FiRotateCw,
		cloudUpload: FiUploadCloud,
		cloudDownload: FiDownloadCloud,
		lock: FiLock,
		unlock: FiUnlock,
		shield: FiShield,
		key: FiKey,
		bell: FiBell,
		message: FiMessageSquare,
		comment: FiMessageCircle,
		help: FiHelpCircle,
		info: FiInfo,
		sun: FiSun,
		moon: FiMoon,
		monitor: FiMonitor,
		mobile: FiSmartphone,
		tablet: FiTablet,
		wifi: FiWifi,
		wifiOff: FiWifiOff,
		database: FiDatabase,
		server: FiServer,
		hardDrive: FiHardDrive,
		cpu: FiCpu,
		zap: FiZap,
		tool: FiTool,
		package: FiPackage,
		box: FiBox,
		archive: FiArchive,
		folder: FiFolder,
		folderPlus: FiFolderPlus,
		filePlus: FiFilePlus,
		image: FiImage,
		video: FiVideo,
		music: FiMusic,
		headphones: FiHeadphones,
		mic: FiMic,
		micOff: FiMicOff,
		camera: FiCamera,
		cameraOff: FiCameraOff,
		map: FiMap,
		mapPin: FiMapPin,
		navigation: FiNavigation,
		compass: FiCompass,
		target: FiTarget,
		award: FiAward,
		gift: FiGift,
		shoppingCart: FiShoppingCart,
		shoppingBag: FiShoppingBag,
		creditCard: FiCreditCard,
		pieChart: FiPieChart,
		barChart: FiBarChart,
		lineChart: FiBarChart2,
		trendingDown: FiTrendingDown,
		maximize: FiMaximize,
		minimize: FiMinimize,
		move: FiMove,
		rotate: FiRotateCw,
		shuffle: FiShuffle,
		repeat: FiRepeat,
		skipBack: FiSkipBack,
		skipForward: FiSkipForward,
		play: FiPlay,
		pause: FiPause,
		stop: FiPause,
		volume: FiVolume,
		volumeOff: FiVolumeX,
		arrowUp: FiArrowUp,
		arrowDown: FiArrowDown,
		arrowLeft: FiArrowLeft,
		arrowRight: FiArrowRight,
		moreHorizontal: FiMoreHorizontal,
		moreVertical: FiMoreVertical,
		chevronUp: FiChevronUp,
		chevronDown: FiChevronDown,
		chevronLeft: FiChevronLeft,
		chevronRight: FiChevronRight,
		externalLink: FiActivity, // Fallback
		link: FiActivity, // Fallback
		unlink: FiActivity, // Fallback
		paperclip: FiActivity, // Fallback
		pin: FiActivity, // Fallback
		hash: FiActivity, // Fallback
		atSign: FiActivity, // Fallback
		percent: FiActivity, // Fallback
		type: FiActivity, // Fallback
		bold: FiActivity, // Fallback
		italic: FiActivity, // Fallback
		underline: FiActivity, // Fallback
		alignLeft: FiActivity, // Fallback
		alignCenter: FiActivity, // Fallback
		alignRight: FiActivity, // Fallback
		code: FiActivity, // Fallback
		terminal: FiActivity, // Fallback
		command: FiActivity, // Fallback
		mousePointer: FiActivity, // Fallback
		crosshair: FiActivity, // Fallback
		qrCode: FiActivity, // Fallback
		fingerprint: FiActivity, // Fallback
		userCheck: FiUsers,
		userPlus: FiUsers,
		userMinus: FiUsers,
		crown: FiActivity, // Fallback
		gem: FiActivity, // Fallback
		coins: FiDollarSign,
		wallet: FiDollarSign,
		receipt: FiFileText,
		calculator: FiActivity, // Fallback
		scale: FiActivity, // Fallback
		gauge: FiActivity, // Fallback
		timer: FiClock,
		stopwatch: FiClock,
		hourglass: FiClock,
		alarmClock: FiClock,
	},
	fa: {
		dashboard: FaChartLine,
		users: FaUsers,
		building: FaBuilding,
		partners: FaHandshake,
		reports: FaChartBar,
		chart: FaChartBar,
		plus: FaPlus,
		logout: FaSignOutAlt,
		settings: FaCog,
		home: FaHome,
		dollar: FaDollarSign,
		calendar: FaCalendarAlt,
		clock: FaClock,
		check: FaCheckCircle,
		alert: FaExclamationCircle,
		warning: FaExclamationTriangle,
		trending: FaChartLine,
		activity: FaChartBar,
		handshake: FaHandshake,
		file: FaFileAlt,
		menu: FaBars,
		close: FaTimes,
		search: FaSearch,
		edit: FaEdit,
		delete: FaTrash,
		eye: FaEye,
		eyeOff: FaEyeSlash,
		mail: FaEnvelope,
		phone: FaPhone,
		globe: FaGlobe,
		download: FaDownload,
		upload: FaUpload,
		print: FaPrint,
		share: FaShare,
		copy: FaCopy,
		heart: FaHeart,
		star: FaStar,
		flag: FaFlag,
		tag: FaTag,
		filter: FaFilter,
		sort: FaSort,
		refresh: FaRedo,
		sync: FaSync,
		cloudUpload: FaCloudUploadAlt,
		cloudDownload: FaCloudDownloadAlt,
		lock: FaLock,
		unlock: FaUnlock,
		shield: FaKey, // Fallback
		key: FaKey,
		bell: FaBell,
		message: FaComments,
		comment: FaComment,
		help: FaQuestionCircle,
		info: FaInfoCircle,
		sun: FaSun,
		moon: FaMoon,
		monitor: FaDesktop,
		mobile: FaMobile,
		tablet: FaTabletAlt,
		wifi: FaWifi,
		wifiOff: FaWifi, // Fallback
		database: FaDatabase,
		server: FaServer,
		hardDrive: FaHdd,
		cpu: FaMicrochip,
		zap: FaBolt,
		tool: FaTools,
		package: FaBox,
		box: FaBox,
		archive: FaArchive,
		folder: FaFolder,
		folderPlus: FaFolderPlus,
		filePlus: FaFileAlt,
		image: FaImage,
		video: FaVideo,
		music: FaMusic,
		headphones: FaHeadphones,
		mic: FaMicrophone,
		micOff: FaMicrophoneSlash,
		camera: FaCamera,
		cameraOff: FaCamera, // Fallback
		map: FaMap,
		mapPin: FaMapMarkerAlt,
		navigation: FaCompass,
		compass: FaCompass,
		target: FaBullseye,
		award: FaAward,
		gift: FaGift,
		shoppingCart: FaShoppingCart,
		shoppingBag: FaShoppingBag,
		creditCard: FaCreditCard,
		pieChart: FaChartPie,
		barChart: FaChartBar,
		lineChart: FaChartArea,
		trendingDown: FaChartLine,
		maximize: FaChartLine, // Fallback
		minimize: FaChartLine, // Fallback
		move: FaChartLine, // Fallback
		rotate: FaRedo,
		shuffle: FaChartLine, // Fallback
		repeat: FaChartLine, // Fallback
		skipBack: FaChartLine, // Fallback
		skipForward: FaChartLine, // Fallback
		play: FaChartLine, // Fallback
		pause: FaChartLine, // Fallback
		stop: FaChartLine, // Fallback
		volume: FaChartLine, // Fallback
		volumeOff: FaChartLine, // Fallback
		arrowUp: FaArrowUp,
		arrowDown: FaArrowDown,
		arrowLeft: FaArrowLeft,
		arrowRight: FaArrowRight,
		moreHorizontal: FaEllipsisH,
		moreVertical: FaEllipsisV,
		chevronUp: FaChevronUp,
		chevronDown: FaChevronDown,
		chevronLeft: FaChevronLeft,
		chevronRight: FaChevronRight,
		externalLink: FaChartLine, // Fallback
		link: FaChartLine, // Fallback
		unlink: FaChartLine, // Fallback
		paperclip: FaChartLine, // Fallback
		pin: FaChartLine, // Fallback
		hash: FaChartLine, // Fallback
		atSign: FaChartLine, // Fallback
		percent: FaChartLine, // Fallback
		type: FaChartLine, // Fallback
		bold: FaChartLine, // Fallback
		italic: FaChartLine, // Fallback
		underline: FaChartLine, // Fallback
		alignLeft: FaChartLine, // Fallback
		alignCenter: FaChartLine, // Fallback
		alignRight: FaChartLine, // Fallback
		code: FaChartLine, // Fallback
		terminal: FaChartLine, // Fallback
		command: FaChartLine, // Fallback
		mousePointer: FaChartLine, // Fallback
		crosshair: FaChartLine, // Fallback
		qrCode: FaChartLine, // Fallback
		fingerprint: FaChartLine, // Fallback
		userCheck: FaUsers,
		userPlus: FaUsers,
		userMinus: FaUsers,
		crown: FaChartLine, // Fallback
		gem: FaChartLine, // Fallback
		coins: FaDollarSign,
		wallet: FaDollarSign,
		receipt: FaFileAlt,
		calculator: FaChartLine, // Fallback
		scale: FaChartLine, // Fallback
		gauge: FaChartLine, // Fallback
		timer: FaClock,
		stopwatch: FaClock,
		hourglass: FaClock,
		alarmClock: FaClock,
	},
	heroicons: {
		dashboard: HiOutlineViewGrid,
		users: HiOutlineUsers,
		building: HiOutlineOfficeBuilding,
		partners: HiOutlineUsers,
		reports: HiOutlineChartBar,
		chart: HiOutlineChartBar,
		plus: HiOutlinePlus,
		logout: HiOutlineLogout,
		settings: HiOutlineCog,
		home: HiOutlineHome,
		dollar: HiOutlineCurrencyDollar,
		calendar: HiOutlineCalendar,
		clock: HiOutlineClock,
		check: HiOutlineCheckCircle,
		alert: HiOutlineExclamationCircle,
		warning: HiOutlineExclamation,
		trending: HiOutlineTrendingUp,
		activity: HiOutlineChartBar,
		handshake: HiOutlineUsers,
		file: HiOutlineDocumentText,
		menu: HiOutlineMenu,
		close: HiOutlineX,
		search: HiOutlineSearch,
		edit: HiOutlinePencil,
		delete: HiOutlineTrash,
		eye: HiOutlineEye,
		eyeOff: HiOutlineEyeOff,
		mail: HiOutlineMail,
		phone: HiOutlinePhone,
		globe: HiOutlineGlobe,
		download: HiOutlineDownload,
		upload: HiOutlineUpload,
		print: HiOutlinePrinter,
		share: HiOutlineShare,
		copy: HiOutlineClipboardCopy,
		heart: HiOutlineHeart,
		star: HiOutlineStar,
		flag: HiOutlineFlag,
		tag: HiOutlineTag,
		filter: HiOutlineFilter,
		sort: HiOutlineSortAscending,
		refresh: HiOutlineRefresh,
		sync: HiOutlineRefresh,
		cloudUpload: HiOutlineCloudUpload,
		cloudDownload: HiOutlineCloudDownload,
		lock: HiOutlineLockClosed,
		unlock: HiOutlineLockOpen,
		shield: HiOutlineShieldCheck,
		key: HiOutlineKey,
		bell: HiOutlineBell,
		message: HiOutlineChat,
		comment: HiOutlineChatAlt,
		help: HiOutlineQuestionMarkCircle,
		info: HiOutlineInformationCircle,
		sun: HiOutlineSun,
		moon: HiOutlineMoon,
		monitor: HiOutlineDesktopComputer,
		mobile: HiOutlineDeviceMobile,
		tablet: HiOutlineDeviceTablet,
		wifi: HiOutlineWifi,
		wifiOff: HiOutlineWifi, // Fallback
		database: HiOutlineDatabase,
		server: HiOutlineServer,
		hardDrive: HiOutlineDatabase, // Fallback
		cpu: HiOutlineDatabase, // Fallback
		zap: HiOutlineDatabase, // Fallback
		tool: HiOutlineDatabase, // Fallback
		package: HiOutlineDatabase, // Fallback
		box: HiOutlineDatabase, // Fallback
		archive: HiOutlineDatabase, // Fallback
		folder: HiOutlineFolder,
		folderPlus: HiOutlineFolderAdd,
		filePlus: HiOutlineDocumentAdd,
		image: HiOutlinePhotograph,
		video: HiOutlineVideoCamera,
		music: HiOutlineMusicNote,
		headphones: HiOutlineMusicNote, // Fallback
		mic: HiOutlineMicrophone,
		micOff: HiOutlineMicrophone, // Fallback
		camera: HiOutlineCamera,
		cameraOff: HiOutlineCamera, // Fallback
		map: HiOutlineMap,
		mapPin: HiOutlineLocationMarker,
		navigation: HiOutlineLocationMarker, // Fallback
		compass: HiOutlineLocationMarker, // Fallback
		target: HiOutlineLocationMarker, // Fallback
		award: HiOutlineLocationMarker, // Fallback
		gift: HiOutlineGift,
		shoppingCart: HiOutlineShoppingCart,
		shoppingBag: HiOutlineShoppingBag,
		creditCard: HiOutlineCreditCard,
		pieChart: HiOutlineChartPie,
		barChart: HiOutlineChartBar,
		lineChart: HiOutlineChartBar,
		trendingDown: HiOutlineTrendingDown,
		maximize: HiOutlineChartBar, // Fallback
		minimize: HiOutlineChartBar, // Fallback
		move: HiOutlineChartBar, // Fallback
		rotate: HiOutlineRefresh,
		shuffle: HiOutlineChartBar, // Fallback
		repeat: HiOutlineChartBar, // Fallback
		skipBack: HiOutlineChartBar, // Fallback
		skipForward: HiOutlineChartBar, // Fallback
		play: HiOutlineChartBar, // Fallback
		pause: HiOutlineChartBar, // Fallback
		stop: HiOutlineChartBar, // Fallback
		volume: HiOutlineChartBar, // Fallback
		volumeOff: HiOutlineChartBar, // Fallback
		arrowUp: HiOutlineArrowUp,
		arrowDown: HiOutlineArrowDown,
		arrowLeft: HiOutlineArrowLeft,
		arrowRight: HiOutlineArrowRight,
		moreHorizontal: HiOutlineDotsHorizontal,
		moreVertical: HiOutlineDotsVertical,
		chevronUp: HiOutlineChevronUp,
		chevronDown: HiOutlineChevronDown,
		chevronLeft: HiOutlineChevronLeft,
		chevronRight: HiOutlineChevronRight,
		externalLink: HiOutlineChartBar, // Fallback
		link: HiOutlineChartBar, // Fallback
		unlink: HiOutlineChartBar, // Fallback
		paperclip: HiOutlineChartBar, // Fallback
		pin: HiOutlineChartBar, // Fallback
		hash: HiOutlineChartBar, // Fallback
		atSign: HiOutlineChartBar, // Fallback
		percent: HiOutlineChartBar, // Fallback
		type: HiOutlineChartBar, // Fallback
		bold: HiOutlineChartBar, // Fallback
		italic: HiOutlineChartBar, // Fallback
		underline: HiOutlineChartBar, // Fallback
		alignLeft: HiOutlineChartBar, // Fallback
		alignCenter: HiOutlineChartBar, // Fallback
		alignRight: HiOutlineChartBar, // Fallback
		code: HiOutlineChartBar, // Fallback
		terminal: HiOutlineChartBar, // Fallback
		command: HiOutlineChartBar, // Fallback
		mousePointer: HiOutlineChartBar, // Fallback
		crosshair: HiOutlineChartBar, // Fallback
		qrCode: HiOutlineChartBar, // Fallback
		fingerprint: HiOutlineChartBar, // Fallback
		userCheck: HiOutlineUsers,
		userPlus: HiOutlineUsers,
		userMinus: HiOutlineUsers,
		crown: HiOutlineChartBar, // Fallback
		gem: HiOutlineChartBar, // Fallback
		coins: HiOutlineCurrencyDollar,
		wallet: HiOutlineCurrencyDollar,
		receipt: HiOutlineDocumentText,
		calculator: HiOutlineChartBar, // Fallback
		scale: HiOutlineChartBar, // Fallback
		gauge: HiOutlineChartBar, // Fallback
		timer: HiOutlineClock,
		stopwatch: HiOutlineClock,
		hourglass: HiOutlineClock,
		alarmClock: HiOutlineClock,
	},
	lucide: {
		dashboard: LayoutDashboard,
		users: Users,
		building: Building,
		partners: Handshake,
		reports: BarChart3,
		chart: BarChart3,
		plus: Plus,
		logout: LogOut,
		settings: Settings,
		home: Home,
		dollar: DollarSign,
		calendar: Calendar,
		clock: Clock,
		check: CheckCircle,
		alert: AlertCircle,
		warning: AlertTriangle,
		trending: TrendingUp,
		activity: Activity,
		handshake: Handshake,
		file: FileText,
		menu: Menu,
		close: X,
		search: Search,
		edit: Edit,
		delete: Trash2,
		eye: Eye,
		eyeOff: EyeOff,
		mail: Mail,
		phone: Phone,
		globe: Globe,
		download: Download,
		upload: Upload,
		print: Printer,
		share: Share2,
		copy: Copy,
		heart: Heart,
		star: Star,
		flag: Flag,
		tag: Tag,
		filter: Filter,
		sort: ArrowUpDown,
		refresh: RefreshCw,
		sync: RotateCw,
		cloudUpload: CloudUpload,
		cloudDownload: CloudDownload,
		lock: Lock,
		unlock: Unlock,
		shield: Shield,
		key: Key,
		bell: Bell,
		message: MessageSquare,
		comment: MessageCircle,
		help: HelpCircle,
		info: Info,
		sun: Sun,
		moon: Moon,
		monitor: Monitor,
		mobile: Smartphone,
		tablet: Tablet,
		wifi: Wifi,
		wifiOff: WifiOff,
		database: Database,
		server: Server,
		hardDrive: HardDrive,
		cpu: Cpu,
		zap: Zap,
		tool: Wrench,
		package: Package,
		box: Box,
		archive: Archive,
		folder: Folder,
		folderPlus: FolderPlus,
		filePlus: FilePlus,
		image: Image,
		video: Video,
		music: Music,
		headphones: Headphones,
		mic: Mic,
		micOff: MicOff,
		camera: Camera,
		cameraOff: CameraOff,
		map: MapIcon,
		mapPin: MapPin,
		navigation: Navigation,
		compass: Compass,
		target: Target,
		award: Award,
		gift: Gift,
		shoppingCart: ShoppingCart,
		shoppingBag: ShoppingBag,
		creditCard: CreditCard,
		pieChart: PieChart,
		barChart: BarChart,
		lineChart: LineChart,
		trendingDown: TrendingDown,
		maximize: Maximize,
		minimize: Minimize,
		move: Move,
		rotate: RotateCw,
		shuffle: Shuffle,
		repeat: Repeat,
		skipBack: SkipBack,
		skipForward: SkipForward,
		play: Play,
		pause: Pause,
		stop: Pause,
		volume: Volume,
		volumeOff: VolumeX,
		arrowUp: ArrowUp,
		arrowDown: ArrowDown,
		arrowLeft: ArrowLeft,
		arrowRight: ArrowRight,
		moreHorizontal: MoreHorizontal,
		moreVertical: MoreVertical,
		chevronUp: ChevronUp,
		chevronDown: ChevronDown,
		chevronLeft: ChevronLeft,
		chevronRight: ChevronRight,
		externalLink: ExternalLink,
		link: Link,
		unlink: Unlink,
		paperclip: Paperclip,
		pin: Pin,
		hash: Hash,
		atSign: AtSign,
		percent: Percent,
		type: Type,
		bold: Bold,
		italic: Italic,
		underline: Underline,
		alignLeft: AlignLeft,
		alignCenter: AlignCenter,
		alignRight: AlignRight,
		code: Code,
		terminal: Terminal,
		command: Command,
		mousePointer: MousePointer,
		crosshair: Crosshair,
		qrCode: QrCode,
		fingerprint: Fingerprint,
		userCheck: UserCheck,
		userPlus: UserPlus,
		userMinus: UserMinus,
		crown: Crown,
		gem: Gem,
		coins: Coins,
		wallet: Wallet,
		receipt: Receipt,
		calculator: Calculator,
		scale: Scale,
		gauge: Gauge,
		timer: Timer,
		stopwatch: Timer,
		hourglass: Hourglass,
		alarmClock: AlarmClock,
	},
};

export interface IconProps {
	name: IconName;
	library?: IconLibrary;
	size?: number | string;
	className?: string;
	color?: string;
}

export const Icon: React.FC<IconProps> = ({
	name,
	library = "lucide",
	size = 16,
	className,
	color,
	...props
}) => {
	const IconComponent = iconMaps[library][name];

	if (!IconComponent) {
		console.warn(`Icon "${name}" not found in library "${library}"`);
		return null;
	}

	return (
		<IconComponent
			size={size}
			color={color}
			className={cn("inline-block", className)}
			{...props}
		/>
	);
};

export default Icon;
