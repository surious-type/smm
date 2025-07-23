<?php

namespace App\Enums;

enum PostType: string
{
    case NEW       = 'NEW';
    case EXISTING  = 'EXISTING';
}
