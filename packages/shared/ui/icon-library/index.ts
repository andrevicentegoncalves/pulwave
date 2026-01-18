/**
 * Icon Library
 *
 * Re-exports from @pulwave/foundation to maintain backward compatibility
 * while moving towards a project-agnostic icon foundation.
 */

import type React from 'react';
import {
    // Actions
    Check, CheckCircle, X, XCircle, Plus, Minus, Edit, Edit2, Edit3, Pencil, Triangle, Hexagon, PenSquare, Trash, Trash2, Save, Download, Upload, Copy, Clipboard, ClipboardCheck, ClipboardCopy, Share, Share2, ExternalLink, Link as LinkIcon, Link2 as Link2Icon, Unlink, Undo, Redo, RefreshCw, RefreshCcw, RotateCw, RotateCcw, MousePointerClick, TextCursorInput, Type, Bold, Italic, ListOrdered, Quote, Workflow, Library,
    // Navigation
    ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsUp, ChevronsDown, ChevronsLeft, ChevronsRight, ArrowUp, ArrowUpCircle, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, ArrowDownLeft, ArrowUpLeft, ArrowDownRight, MoveUp, MoveDown, MoveLeft, MoveRight, Home, Menu as MenuIcon, MoreHorizontal, MoreVertical, Grip, GripVertical, GripHorizontal, Navigation2, PanelTopClose, GalleryHorizontalEnd, GitBranch, GitMerge, ToggleRight,
    // Communication
    Mail, Send, MessageSquare, MessageCircle, Phone, PhoneCall, PhoneOff, Video, VideoOff, Bell, BellOff, BellRing, Smartphone,
    // Feedback
    AlertCircle, AlertTriangle, AlertOctagon, Info, HelpCircle, CheckCircle2, XOctagon, Ban, ThumbsUp, ThumbsDown, Star, Heart, Loader, Loader2, StarHalf,
    // Media
    Image, ImagePlus, Camera, Play, Pause, Square, Circle, CircleDashed, Volume, Volume1, Volume2, VolumeX, Mic, MicOff, Film, Music,
    // Files
    File, FileText, FilePlus, FileMinus, FileCheck, FileX, Files, Folder, FolderTree, FolderOpen, FolderPlus, FolderMinus, Archive, Paperclip, Printer, FileSpreadsheet, FileJson, ScrollText, BookOpen,
    // User
    User, UserPlus, UserMinus, UserCheck, UserX, Users, UserCircle, LogIn, LogOut, Key, KeyRound, Lock, Unlock, Shield, ShieldCheck, ShieldOff,
    // Interface
    Eye, EyeOff, Search, ZoomIn, ZoomOut, Filter, SlidersHorizontal, Settings, Settings2, Cog, Wrench, Maximize, Maximize2, Minimize, Minimize2, Expand, Shrink, Columns, Rows, Grid as GridIcon, List, LayoutGrid, LayoutDashboard, LayoutList, Table, Table2, PanelLeft, PanelRight, Sidebar, SidebarOpen, SidebarClose, FormInput, CheckSquare, ChevronDownSquare, ListFilter, Layout, ToggleLeft,
    Frame, Ruler, Move, Monitor, MonitorSmartphone, Ratio, ScanLine, AlignVerticalSpaceAround, AlignHorizontalSpaceAround, Blend, Pipette, CircleDot, Binary, Sigma, Component, AppWindow, Ruler as RulerIconLucide, BoxSelect as BoxSelectLucide,
    // Data & Charts (using Chart* prefix to avoid collision with chart components)
    BarChart2, BarChart3, BarChart4, TrendingUp, TrendingDown, Activity, Database, HardDrive, Server, Network, GitFork, Spline, ChartArea, ChartLine, ChartPie, ChartScatter, ChartBar, ChartSpline, ChartNetwork,
    // Time
    Calendar, CalendarDays, CalendarCheck, CalendarX, CalendarPlus, CalendarMinus, Clock, Timer, TimerOff, Hourglass, History,
    // Commerce
    ShoppingCart, ShoppingBag, CreditCard, Wallet, Receipt, Package, Gift, Tag as TagIcon, Tags, Percent, DollarSign, Euro, Bitcoin,
    // Misc
    Globe, Languages, Building, Building2, Map, MapPin, Navigation, Plane, Compass, Sun, Moon, Cloud, CloudOff, Wifi, WifiOff, Bluetooth, Battery, BatteryCharging, BatteryLow, BatteryFull, Zap, Power, Terminal, Code, Code2, Braces, Hash, AtSign, Bookmark, Flag, Award, Crown, Sparkles, Palette, Box as BoxIcon, Accessibility, Layers, Puzzle, Rocket, Smile, Shapes, Gauge, Dumbbell, Waves, Shirt, Briefcase, Keyboard, FunctionSquare as FunctionSquareLucide,
} from 'lucide-react';

// Interface
import { RulerIcon } from './custom/RulerIcon';
import { BoxSelect } from './custom/BoxSelect';

// Misc
import { FunctionSquare } from './custom/FunctionSquare';

export type { BaseIconProps, IconComponent } from './types';

// Named exports for direct imports (tree-shakeable)
export {
    // Actions
    Check, CheckCircle, X, XCircle, Plus, Minus, Edit, Edit2, Edit3, Pencil, Triangle, Hexagon, PenSquare, Trash, Trash2, Save, Download, Upload, Copy, Clipboard, ClipboardCheck, ClipboardCopy, Share, Share2, ExternalLink, LinkIcon, Link2Icon, Unlink, Undo, Redo, RefreshCw, RefreshCcw, RotateCw, RotateCcw, MousePointerClick, TextCursorInput, Type, Bold, Italic, ListOrdered, Quote, Workflow, Library,
    // Navigation
    ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsUp, ChevronsDown, ChevronsLeft, ChevronsRight, ArrowUp, ArrowUpCircle, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, ArrowDownLeft, ArrowUpLeft, ArrowDownRight, MoveUp, MoveDown, MoveLeft, MoveRight, Home, MenuIcon, MoreHorizontal, MoreVertical, Grip, GripVertical, GripHorizontal, Navigation2, PanelTopClose, GalleryHorizontalEnd, GitBranch, GitMerge, ToggleRight,
    // Communication
    Mail, Send, MessageSquare, MessageCircle, Phone, PhoneCall, PhoneOff, Video, VideoOff, Bell, BellOff, BellRing, Smartphone,
    // Feedback
    AlertCircle, AlertTriangle, AlertOctagon, Info, HelpCircle, CheckCircle2, XOctagon, Ban, ThumbsUp, ThumbsDown, Star, Heart, Loader, Loader2, StarHalf,
    // Media
    Image, ImagePlus, Camera, Play, Pause, Square, Circle, CircleDashed, Volume, Volume1, Volume2, VolumeX, Mic, MicOff, Film, Music,
    // Files
    File, FileText, FilePlus, FileMinus, FileCheck, FileX, Files, Folder, FolderTree, FolderOpen, FolderPlus, FolderMinus, Archive, Paperclip, Printer, FileSpreadsheet, FileJson, ScrollText, BookOpen,
    // User
    User, UserPlus, UserMinus, UserCheck, UserX, Users, UserCircle, LogIn, LogOut, Key, KeyRound, Lock, Unlock, Shield, ShieldCheck, ShieldOff,
    // Interface
    Eye, EyeOff, Search, ZoomIn, ZoomOut, Filter, SlidersHorizontal, Settings, Settings2, Cog, Wrench, Maximize, Maximize2, Minimize, Minimize2, Expand, Shrink, Columns, Rows, GridIcon, List, LayoutGrid, LayoutDashboard, LayoutList, Table, Table2, PanelLeft, PanelRight, Sidebar, SidebarOpen, SidebarClose, FormInput, CheckSquare, ChevronDownSquare, ListFilter, Layout, ToggleLeft,
    Frame, Ruler, Move, Monitor, MonitorSmartphone, Ratio, ScanLine, AlignVerticalSpaceAround, AlignHorizontalSpaceAround, Blend, Pipette, CircleDot, Binary, Sigma, Component, AppWindow, RulerIcon, BoxSelect,
    // Data & Charts (using Chart* prefix to avoid collision with chart components)
    BarChart2, BarChart3, BarChart4, TrendingUp, TrendingDown, Activity, Database, HardDrive, Server, Network, GitFork, Spline, ChartArea, ChartLine, ChartPie, ChartScatter, ChartBar, ChartSpline, ChartNetwork,
    // Time
    Calendar, CalendarDays, CalendarCheck, CalendarX, CalendarPlus, CalendarMinus, Clock, Timer, TimerOff, Hourglass, History,
    // Commerce
    ShoppingCart, ShoppingBag, CreditCard, Wallet, Receipt, Package, Gift, TagIcon, Tags, Percent, DollarSign, Euro, Bitcoin,
    // Misc
    Globe, Languages, Building, Building2, Map, MapPin, Navigation, Plane, Compass, Sun, Moon, Cloud, CloudOff, Wifi, WifiOff, Bluetooth, Battery, BatteryCharging, BatteryLow, BatteryFull, Zap, Power, Terminal, Code, Code2, Braces, Hash, AtSign, Bookmark, Flag, Award, Crown, Sparkles, Palette, BoxIcon, Accessibility, Layers, Puzzle, Rocket, Smile, Shapes, Gauge, Dumbbell, Waves, Shirt, Briefcase, Keyboard, FunctionSquare,
};

// Icon registry for dynamic lookup by name (used by Icon component's `name` prop)
// This enables dynamic lookup while keeping imports explicit
export const ICON_REGISTRY: Record<string, React.ComponentType> = {
    // Actions
    Check, CheckCircle, X, XCircle, Plus, Minus, Edit, Edit2, Edit3, Pencil, Triangle, Hexagon, PenSquare, Trash, Trash2, Save, Download, Upload, Copy, Clipboard, ClipboardCheck, ClipboardCopy, Share, Share2, ExternalLink, LinkIcon, Link2Icon, Unlink, Undo, Redo, RefreshCw, RefreshCcw, RotateCw, RotateCcw, MousePointerClick, TextCursorInput, Type, Bold, Italic, ListOrdered, Quote, Workflow, Library,
    // Navigation
    ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsUp, ChevronsDown, ChevronsLeft, ChevronsRight, ArrowUp, ArrowUpCircle, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, ArrowDownLeft, ArrowUpLeft, ArrowDownRight, MoveUp, MoveDown, MoveLeft, MoveRight, Home, MenuIcon, MoreHorizontal, MoreVertical, Grip, GripVertical, GripHorizontal, Navigation2, PanelTopClose, GalleryHorizontalEnd, GitBranch, GitMerge, ToggleRight,
    // Communication
    Mail, Send, MessageSquare, MessageCircle, Phone, PhoneCall, PhoneOff, Video, VideoOff, Bell, BellOff, BellRing, Smartphone,
    // Feedback
    AlertCircle, AlertTriangle, AlertOctagon, Info, HelpCircle, CheckCircle2, XOctagon, Ban, ThumbsUp, ThumbsDown, Star, Heart, Loader, Loader2, StarHalf,
    // Media
    Image, ImagePlus, Camera, Play, Pause, Square, Circle, CircleDashed, Volume, Volume1, Volume2, VolumeX, Mic, MicOff, Film, Music,
    // Files
    File, FileText, FilePlus, FileMinus, FileCheck, FileX, Files, Folder, FolderTree, FolderOpen, FolderPlus, FolderMinus, Archive, Paperclip, Printer, FileSpreadsheet, FileJson, ScrollText, BookOpen,
    // User
    User, UserPlus, UserMinus, UserCheck, UserX, Users, UserCircle, LogIn, LogOut, Key, KeyRound, Lock, Unlock, Shield, ShieldCheck, ShieldOff,
    // Interface
    Eye, EyeOff, Search, ZoomIn, ZoomOut, Filter, SlidersHorizontal, Settings, Settings2, Cog, Wrench, Maximize, Maximize2, Minimize, Minimize2, Expand, Shrink, Columns, Rows, GridIcon, List, LayoutGrid, LayoutDashboard, LayoutList, Table, Table2, PanelLeft, PanelRight, Sidebar, SidebarOpen, SidebarClose, FormInput, CheckSquare, ChevronDownSquare, ListFilter, Layout, ToggleLeft,
    Frame, Ruler, Move, Monitor, MonitorSmartphone, Ratio, ScanLine, AlignVerticalSpaceAround, AlignHorizontalSpaceAround, Blend, Pipette, CircleDot, Binary, Sigma, Component, AppWindow, RulerIcon, BoxSelect,
    // Data & Charts (using Chart* prefix to avoid collision with chart components)
    BarChart2, BarChart3, BarChart4, TrendingUp, TrendingDown, Activity, Database, HardDrive, Server, Network, GitFork, Spline, ChartArea, ChartLine, ChartPie, ChartScatter, ChartBar, ChartSpline, ChartNetwork,
    // Time
    Calendar, CalendarDays, CalendarCheck, CalendarX, CalendarPlus, CalendarMinus, Clock, Timer, TimerOff, Hourglass, History,
    // Commerce
    ShoppingCart, ShoppingBag, CreditCard, Wallet, Receipt, Package, Gift, TagIcon, Tags, Percent, DollarSign, Euro, Bitcoin,
    // Misc
    Globe, Languages, Building, Building2, Map, MapPin, Navigation, Plane, Compass, Sun, Moon, Cloud, CloudOff, Wifi, WifiOff, Bluetooth, Battery, BatteryCharging, BatteryLow, BatteryFull, Zap, Power, Terminal, Code, Code2, Braces, Hash, AtSign, Bookmark, Flag, Award, Crown, Sparkles, Palette, BoxIcon, Accessibility, Layers, Puzzle, Rocket, Smile, Shapes, Gauge, Dumbbell, Waves, Shirt, Briefcase, Keyboard, FunctionSquare,
};
