#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
清理课程数据脚本
直接处理 courses.json，过滤掉课程介绍里不该出现的内容
"""

import json
import re


def clean_course_content(content_text, title=''):
    """
    清理课程内容
    去除作者信息、发布时间、价格、下载链接等不该出现在课程介绍里的内容
    只保留真正的课程介绍正文
    """
    if not content_text:
        return ''
    
    # 定义需要过滤的关键词
    useless_patterns = [
        # 作者和社交相关
        '悠悠云学社',
        '关注', '私信', '点赞', '分享',
        'QQ空间', '微博', 'QQ好友', '海报分享', '复制链接', '收藏',
        
        # 会员和价格相关
        '会员免费', '付费资源', '限时特惠', '云币',
        
        # 按钮和UI元素
        '资源下载',
        
        # 结尾和版权相关
        'THE END', '喜欢就支持我吧',
        '感谢您的来访，获取更多精彩文章请收藏本站。',
        '版权声明',
        '本内容转载于网络，版权归原作者所有！',
        '本站仅提供信息存储空间服务，不拥有所有权，不承担相关法律责任。',
        '本内容若侵犯到你的版权利益，请联系我们，会尽快给予删除处理！',
        '本站全资源仅供测试和学习，请勿用于非法操作，一切后果与本站无关。',
        '如遇到充值付费环节课程或软件 请马上删除退出 涉及自身权益/利益 需要投资的一律不要相信，访客发现请向客服举报。',
        '本教程仅供揭秘 请勿用于非法违规操作 否则和作者 官网 无关',
        
        # 免责声明
        '本文仅为课程介绍，不构成任何收益承诺',
        '变现效果因人而异',
        '需结合自身努力与实操',
        '合理运用课程所学内容',
        '同时严格遵守平台相关规则与相关法律法规',
        
        # 版权符号
        '©',
    ]

    # 时间相关正则表达式
    time_patterns = [
        r'\d+天前发布',
        r'\d+小时前发布',
        r'\d+分钟前发布',
        r'今天发布',
        r'昨天发布',
        r'\d{4}年\d{1,2}月\d{1,2}日.*发布',
    ]

    # 价格相关正则表达式（如 9.9、99、9.90等单独数字）
    price_pattern = r'^[\d.]+$'
    
    # 包含价格的行（如 "9.9"、"价格：9.9"、"售价 9.9元"等）
    price_line_patterns = [
        r'^[\d.]+$',           # 纯数字价格
        r'^价格[:：]\s*[\d.]+', # 价格：9.9
        r'^售价[:：]\s*[\d.]+', # 售价：9.9
        r'^原价[:：]\s*[\d.]+', # 原价：9.9
    ]

    lines = content_text.split('\n')
    cleaned_lines = []
    seen_lines = set()
    skip_mode = False  # 遇到下载链接后跳过后续内容

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # 如果进入跳过模式，跳过后续所有内容
        if skip_mode:
            continue

        # 如果遇到下载链接相关关键词，开启跳过模式
        if any(keyword in line for keyword in ['课程下载', '下载密码', 'pan.baidu.com', '百度网盘']):
            skip_mode = True
            continue

        # 跳过纯数字（如价格 9.9）
        if re.match(price_pattern, line):
            continue

        # 跳过包含无用关键词的行
        if any(pattern in line for pattern in useless_patterns):
            continue

        # 跳过时间相关的行
        if any(re.match(pattern, line) for pattern in time_patterns):
            continue

        # 跳过与标题完全重复的行
        if title and line == title:
            continue

        # 跳过已经添加过的行（去重）
        if line in seen_lines:
            continue

        seen_lines.add(line)
        cleaned_lines.append(line)

    return '\n'.join(cleaned_lines)


def clean_courses_json():
    """清理 courses.json 文件中的课程内容"""
    
    # 读取课程数据
    courses_path = 'c:/Users/wenzai/Desktop/ai数据网/projects/src/app/premium/courses.json'
    
    print(f'📂 正在读取课程数据...')
    with open(courses_path, encoding='utf-8') as f:
        courses = json.load(f)
    
    print(f'✅ 已加载 {len(courses)} 门课程')
    
    # 统计清理情况
    cleaned_count = 0
    empty_count = 0
    
    for idx, course in enumerate(courses):
        original_content = course.get('content', '')
        title = course.get('title', '')
        
        # 清理内容
        cleaned_content = clean_course_content(original_content, title)
        
        # 更新课程数据
        course['content'] = cleaned_content
        
        # 更新描述（取清理后内容的前100字）
        course['description'] = cleaned_content[:100] + '...' if len(cleaned_content) > 100 else cleaned_content
        
        # 统计
        if cleaned_content != original_content:
            cleaned_count += 1
        if not cleaned_content:
            empty_count += 1
        
        if (idx + 1) % 500 == 0:
            print(f'✅ 已处理 {idx + 1}/{len(courses)} 门课程')
    
    # 保存清理后的数据
    print(f'\n💾 正在保存清理后的数据...')
    with open(courses_path, 'w', encoding='utf-8') as f:
        json.dump(courses, f, ensure_ascii=False, indent=2)
    
    print(f'\n✨ 清理完成！')
    print(f'📊 统计信息:')
    print(f'   总课程数: {len(courses)}')
    print(f'   已清理: {cleaned_count} 门')
    print(f'   内容为空: {empty_count} 门')
    print(f'   未修改: {len(courses) - cleaned_count} 门')


if __name__ == '__main__':
    print('=' * 60)
    print('🚀 开始清理课程数据...')
    print('=' * 60)
    
    clean_courses_json()
    
    print('\n' + '=' * 60)
    print('✨ 全部完成！')
    print('=' * 60)
