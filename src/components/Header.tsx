import { Link } from '@tanstack/react-router';
import { ThemeToggle } from '@/components/theme-toggle.tsx';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from '@/components/ui/navigation-menu.tsx';

export default function Header() {
    return (
        <header className="p-2 flex gap-2 justify-between">
            <NavigationMenu>
                <NavigationMenuList>
                    <nav className="flex flex-row">
                        <div className="px-2 font-bold">
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/tasks">Задачи</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </div>
                        <div className="px-2 font-bold">
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/panels">Панели</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </div>
                        <div className="px-2 font-bold">
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/notes">Заметки</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </div>
                        <div className="px-2 font-bold">
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/users">Пользователи</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </div>
                        <div className="px-2 font-bold">
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/settings">Настройки</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </div>
                        <div className="px-2 font-bold">
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/logs">Логи</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </div>
                    </nav>
                </NavigationMenuList>
            </NavigationMenu>
            <ThemeToggle />
        </header>
    );
}
