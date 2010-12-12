#! /usr/bin/perl

use strict;
use warnings;

my $row_num = 5000;
my $col_num = 4;
my $max_value_len = 200;
my $min_value_len = 10;
my $alphabet_ascii_begin = 65;
# my $alphabet_ascii_range = 61;
my $alphabet_ascii_range = 26;

&main();
&exit();

sub makeRandomSentence {
  my $len = shift;
  my $ret = '';

  foreach (0 .. $len - 1) {
    $ret .= sprintf "%c", $alphabet_ascii_begin + int(rand(1) * $alphabet_ascii_range);
  }

  return $ret;
}

sub main {
  print "[\n";

  foreach my $row (1 .. $row_num) {
    my $line = "\t[";

    foreach my $col (1 .. $col_num) {
      $line .= '"' . &makeRandomSentence($min_value_len + int rand $max_value_len - $min_value_len) . '"';
      $line .= ", " if ($col < $col_num);
    }

    $line .= "]";
    $line .= "," if ($row < $row_num);
    $line .= "\n";

    print $line;
  }

  print "]\n";
}
